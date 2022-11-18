
import express from 'express';

const app = express();

export default function api() {

    app.get('/api', (req, res) => {
        res.send('Hello World!');
    });

    app.listen( "5172", () => {
        console.log('Example app listening on port 5173!');
    });

}