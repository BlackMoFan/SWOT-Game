from flask import Flask
from flask_cors import CORS
from routes.simulation import simulation_bp
from gevent.pywsgi import WSGIServer

app = Flask(__name__)
CORS(app)

app.register_blueprint(simulation_bp)

@app.route('/')
def home():
    return "Welcome to the SWOT Simulation Game API!"

if __name__ == '__main__':
    # Use gevent WSGIServer
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()