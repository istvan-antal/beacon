node('nodejs') {
    dir('build') {
        stage('checkout') {
            checkout scm
        }

        stage('npm install') {
            sh "npm install"
        }

        stage('build') {
            sh "npm run build"
        }

        sh 'tar -czvf ../archive.tar.gz .'
    }

    archiveArtifacts 'archive.tar.gz'
}