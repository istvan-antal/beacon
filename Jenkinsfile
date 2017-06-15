node('nodejs') {
    def version
    def artifactName

    dir('build') {
        stage('checkout') {
            checkout scm
        }

        version = (sh(returnStdout: true, script: 'git describe --tags')).trim()
        artifactName = "beacon-${version}.tar.gz"

        stage('npm install') {
            sh "npm install"
        }

        stage('build') {
            sh "npm run build"
        }

        sh "tar -czvf ../${artifactName} --exclude .git --exclude src ."
    }

    archiveArtifacts artifactName

    cleanWs()

    stage('deploy') {
        build 'beacon-deploy/master'
    }
}