pipeline {
    agent any

    environment {
        APP_DIR = '.'  // Replace with your application directory
        NODE_ENV = 'production'
    }

    triggers {
        // Automatically triggers the pipeline when there's a push event from GitHub
        pollSCM('H/5 * * * *') // You can replace this with a webhook trigger
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Pull the latest code from GitHub
                git branch: 'main', credentialsId: 'github-secret', url: 'https://github.com/DSC-project-group-1/backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Navigate to the app directory and install dependencies
                dir(APP_DIR) {
                    bat 'npm install'
                }
            }
        }

        stage('Restart Server') {
            steps {
                dir(APP_DIR) {
                    // Kill any process using port 5000 (Windows command)
                    bat '''
                        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /f /pid %%a
                    '''
                    bat 'npm run start'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        failure {
            echo 'Pipeline failed. Check logs for errors.'
        }
    }
}
