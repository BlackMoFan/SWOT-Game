# this part is not used

from flask import Blueprint, request, jsonify
from utils.database import get_db

simulation_bp = Blueprint('simulation', __name__)

@simulation_bp.route('/api/simulation/save', methods=['POST'])
def save_simulation_data():
    data = request.json

    if not data:
        return jsonify({'error': 'Invalid or missing JSON body'}), 400
    
    team = data.get('team')
    factors = data.get('factors')

    if not team or not factors:
        return jsonify({'error': 'Team and factors are required'}), 400

    conn = get_db()
    cursor = conn.cursor()

    for factor in factors:
        name = factor.get('name')
        score = factor.get('score')
        explanation = factor.get('explanation')

        if not name or score is None or not explanation:
            return jsonify({'error': 'Factor name, score, and explanation are required'}), 400

        cursor.execute(
            'INSERT INTO simulation_data (team, factor_name, score, explanation) VALUES (%s, %s, %s, %s)',
            (team, name, score, explanation)
        )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Simulation data saved successfully'}), 201

@simulation_bp.route('/api/simulation/data', methods=['GET'])
def get_simulation_data():
    team = request.args.get('team')

    if not team:
        return jsonify({'error': 'Team is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        'SELECT factor_name, score, explanation FROM simulation_data WHERE team = %s',
        (team,)
    )
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    data = [{'factor_name': row[0], 'score': row[1], 'explanation': row[2]} for row in results]

    return jsonify(data), 200