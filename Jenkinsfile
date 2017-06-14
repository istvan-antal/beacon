node('nodejs') {
    stage('checkout') {
        checkout scm
    }

    stage('npm install') {
        sh "npm install"
    }

    stage('build') {
        sh "npm run build"
    }
}