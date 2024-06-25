module.exports = {
    apps: [
        {
            name: 'aha',
            script: './app.js',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            interpreter: '/home/ec2-user/.nvm/versions/node/v20.12.2/bin/node',
            max_restarts: 10,
            cron_restart: '0 0 * * *',
            exec_mode: 'fork',
            instances: '1',
            autorestart: true,
            watch: true,
        },
    ],
};
