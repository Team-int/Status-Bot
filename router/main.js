module.exports = (app, client) => {
	
	/*
	 * @type POST
	 * Status Post Data
	 */
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
			
        	const statuDB = await client.db.findOne({token: req.body.token});
            
            if (!statuDB)
                throw new Error({
                    code: 401,
                    message: 'Unauthorized',
                });
			
        	if (req.body.desc) {
				client.db.updateOne({_id: statuDB._id}, {
					$set: {
						status: req.body.status
					}
				});
				
				res.status(200).send({
				   message: "Successfully changed status" 
				});
			} else {
				client.db.updateOne({_id: statuDB._id}, {
					$set: {
						status: req.body.status
					}
            	});
				res.status(200).send({
				   message: "Successfully changed status" 
				});
			}
        } catch (e) {
            console.log(e);
            if (e.code)
                res.status(e.code).send(JSON.stringify(e));
            else
                res.status(400).send({message: e.toString()});
        }
    });
	
	/*
	 * @type GET
	 * Status GET Data
	 */
	app.get('/status/:id', async (req, res) => {
		const { id } = req.params;
		
		if(!id) {
			return res.status(404).send({
				message : "Not Found"
			});
		}
        
        const status = await client.db.findOne({_id: id});
		
		res.status(200).send({
			id: id,
			data: status.status,
		})
	})
	
	app.get('/', async (req, res) => {
		res.status(200).send({
			message: "Hello World. Read To Document https://github.com/Team-int/Status-Bot/wiki"
		})
	})
} 