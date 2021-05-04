module.exports = (app, client) => {
    app.post('/status', async (req, res) => {
        try {
            if (!req.body.status)
                throw new Error({
                    code: 400,
                    message: 'Status can not be null',
                });
            if (!req.body.token)
                throw new Error({
                    code: 401,
                    message: 'Unauthorized',
                });
        // https://github.com/Team-int/intbot/blob/master/commands/sell.js 이거 뭐했다고 한글이 많음?
            const statuDB = await client.db.findOne({token: req.body.token});
            
            if (!statuDB)
                throw new Error({
                    code: 401,
                    message: 'Unauthorized',
                });
        
            client.db.updateOne({_id: statuDB._id}, {
                $set: {
                    status: req.body.status
                }
            });
            
            res.status(200).send({
               message: "Successfully changed status" 
            });
        } catch (e) {
            console.log(e);
            if (e.code)
                res.status(e.code).send(JSON.stringify(e));
            else
                res.status(400).send({message: e.toString()});
        }
    });
	app.get('/status/:bot_id', async (req, res) => {
		const { bot_id } = req.params;
		
		if(!bot_id) {
			return res.status(404).send({
				message : "Not Found"
			});
		}
        
        const status = await client.db.findOne({_id: bot_id});
		console.log(status);
		res.status(200).send({
			id: bot_id,
			data: status.status,
		})
	})
} 