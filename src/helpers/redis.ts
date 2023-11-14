const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;

type Commands = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fecthRedis(
    command: Commands, 
    ...args:(string | number)[] )
    {

    const commandUrl = `${UPSTASH_REDIS_REST_URL}/${command}/${args.join('/')}`;

    const response = await fetch(
        commandUrl, 
        {
            headers:{
                Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
            },
        cache: "no-cache"
    });

    if(!response.ok){
        throw new Error('Error executing redis command: '+ response.statusText);
    }

    const data = await response.json();
    return data.result;
}