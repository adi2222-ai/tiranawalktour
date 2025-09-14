from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = os.environ.get('SESSION_SECRET', 'your-secret-key-here')

# Load tour data
def load_tours():
    try:
        with open('tours.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Save booking data
def save_booking(booking_data):
    try:
        # Load existing bookings
        if os.path.exists('bookings.json'):
            with open('bookings.json', 'r') as f:
                bookings = json.load(f)
        else:
            bookings = []
        
        # Add new booking
        bookings.append(booking_data)
        
        # Save back to file
        with open('bookings.json', 'w') as f:
            json.dump(bookings, f, indent=2)
        
        return True
    except Exception as e:
        print(f"Error saving booking: {e}")
        return False

@app.route('/')
def index():
    tours = load_tours()
    return render_template('index.html', tours=tours)

@app.route('/tour/<tour_id>')
def tour_detail(tour_id):
    tours = load_tours()
    tour = next((t for t in tours if t['id'] == tour_id), None)
    if not tour:
        return redirect(url_for('index'))
    return render_template('tour_detail.html', tour=tour)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/book', methods=['POST'])
def book_tour():
    # Validation
    required_fields = ['tour_id', 'user_name', 'user_email', 'user_phone', 'preferred_date_time', 'number_of_people']
    errors = []
    
    # Check required fields
    for field in required_fields:
        if not request.form.get(field) or not str(request.form.get(field)).strip():
            errors.append(f'{field.replace("_", " ").title()} is required')
    
    # Email validation
    import re
    email = request.form.get('user_email', '').strip()
    if email and not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        errors.append('Please enter a valid email address')
    
    # Number of people validation
    try:
        num_people = int(request.form.get('number_of_people', 0))
        if num_people < 1 or num_people > 20:
            errors.append('Number of people must be between 1 and 20')
    except (ValueError, TypeError):
        errors.append('Number of people must be a valid number')
        num_people = 1
    
    # Tour exists validation
    tours = load_tours()
    tour_id = request.form.get('tour_id')
    if not any(t['id'] == tour_id for t in tours):
        errors.append('Invalid tour selected')
    
    if errors:
        return jsonify({'success': False, 'message': '; '.join(errors)})
    
    booking_data = {
        'booking_id': str(uuid.uuid4()),
        'tour_id': tour_id,
        'user_name': (request.form.get('user_name') or '').strip(),
        'user_email': email,
        'user_phone': (request.form.get('user_phone') or '').strip(),
        'number_of_people': num_people,
        'preferred_date_time': (request.form.get('preferred_date_time') or '').strip(),
        'special_requests': (request.form.get('special_requests') or '').strip(),
        'booking_time': datetime.now().isoformat()
    }
    
    if save_booking(booking_data):
        return jsonify({'success': True, 'message': 'Booking successful! We will contact you soon to confirm details.'})
    else:
        return jsonify({'success': False, 'message': 'Booking failed due to server error. Please try again or contact us directly.'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)