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
                git branch: 'main', credentialsId: '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', url: 'https://github.com/DSC-project-group-1/backend.git'
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
                // Restart the server using PM2
                dir(APP_DIR) {
                    bat 'npm run start' // Adjust server entry point
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
