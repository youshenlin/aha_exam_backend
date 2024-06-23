exports.apps = [
    {
        name: 'aha',
        script: './app.js',
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        max_restarts: 10,
        instances: '1',
        autorestart: true,
        watch: true,
    }
];