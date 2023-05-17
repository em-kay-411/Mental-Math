pipeline {
    agent any

    stages {
        stage('Fetch code') {
            steps {
                 git credentialsId: 'git-credentials', url: 'https://github.com/em-kay-411/Crunch-Math-Training.git', branch: 'main'
            }
        }

        stage('Build Docker image') {
            steps {
                sh 'docker build -t emkay411/crunch .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    sh "docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}"
                    sh "docker push emkay411/crunch"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-credentials', keyFileVariable: 'SSH_KEY')]) {
                    sh "ssh -o StrictHostKeyChecking=no -i $SSH_KEY ubuntu@3.90.26.172 'sudo -i && cd Crunch-Math-Training && docker pull emkay411/crunch && docker run -d -p 80:80 emkay411/crunch'"
                }
            }
        }
    }
}
