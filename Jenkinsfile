node('nodejs') {
    def version = (sh(returnStdout: true, script: 'git describe --tags')).trim()
    def artifactName = "beacon-${version}.tar.gz"

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

        sh "tar -czvf ../${artifactName} ."
    }

    archiveArtifacts artifactName

    cleanWs()
}