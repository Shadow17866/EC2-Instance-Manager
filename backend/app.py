from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_latest_ami(region):
    """Fetch the latest Amazon Linux AMI ID for the given region."""
    try:
        ec2_client = boto3.client("ec2", region_name=region)
        response = ec2_client.describe_images(
            Owners=["amazon"],
            Filters=[
                {"Name": "name", "Values": ["amzn2-ami-hvm-2.0.*-x86_64-gp2"]}
            ]
        )
        images = sorted(response['Images'], key=lambda x: x['CreationDate'], reverse=True)
        return images[0]['ImageId'] if images else None
    except Exception as e:
        print(f"Error fetching AMI: {e}")
        return None

@app.route('/deploy', methods=['POST'])
def deploy():
    """Deploy EC2 instances."""
    data = request.get_json()
    region = data['region']
    instances = int(data['instances'])

    ami_id = get_latest_ami(region)
    if not ami_id:
        return jsonify({"status": "failed", "message": "Could not fetch AMI."}), 400

    try:
        ec2_client = boto3.client("ec2", region_name=region)
        ec2_client.run_instances(
            ImageId=ami_id,
            InstanceType="t2.micro",
            MinCount=instances,
            MaxCount=instances
        )
        return jsonify({"status": "success", "message": f"{instances} instance(s) launched in {region}."})
    except Exception as e:
        print(f"Error deploying instances: {e}")
        return jsonify({"status": "failed", "message": str(e)}), 400

@app.route('/terminate', methods=['POST'])
def terminate():
    """Terminate an EC2 instance."""
    data = request.get_json()
    region = data['terminate_region']
    instance_id = data['instance_id']

    try:
        ec2_client = boto3.client("ec2", region_name=region)
        ec2_client.terminate_instances(InstanceIds=[instance_id])
        return jsonify({"status": "success", "message": f"Instance {instance_id} terminated in {region}."})
    except Exception as e:
        print(f"Error terminating instance: {e}")
        return jsonify({"status": "failed", "message": str(e)}), 400

@app.route('/api/get_instances', methods=['GET'])
def get_instances():
    region = request.args.get('region')
    print(f"Fetching instances in region: {region}")
    if not region:
        return jsonify({'status': 'failed', 'message': 'Region is required'}), 400

    try:
        ec2 = boto3.client('ec2', region_name=region)
        response = ec2.describe_instances()
        print(f"Response from EC2 describe_instances: {response}")
        instances = []
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                instances.append({
                    'InstanceId': instance['InstanceId'],
                    'InstanceType': instance['InstanceType'],
                    'State': instance['State']['Name'],
                    'LaunchTime': instance['LaunchTime'].isoformat()
                })

        return jsonify({'status': 'success', 'instances': instances})

    except Exception as e:
        return jsonify({'status': 'failed', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
