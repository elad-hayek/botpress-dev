import axios from 'axios';
import { Client } from '@botpress/client'
import getUuidByString from "uuid-by-string";
import { randomUUID } from 'crypto';


const API_BASE = ' http://localhost:3000' 

export const startListener = () => {
    console.log('start listening')
    const token = 'bp_pat_3Z0lsrrE4QRk3kjHweFXCJzsEFiCLkGtZxwu'
    const workspaceId = 'wkspace_01HEWR5YRZRHPNSW9Q5GTVPCY3'
    const client = new Client({ token, workspaceId })

    sendMessage(client, "2023-12-11T18:33:00")
    // setTimeout(()=>{
    //     [1].forEach(async ()=>{
    //     })
    // }, 10000)
}

const fetchStates = async () => {
    const states = await axios.get(`${API_BASE}/states`)
    return states
}

const sendMessage = async (client: Client, dateTime: string) => {
    await client.createMessage({
        type: "text",
        userId: getUuidByString("6035673625"),
        conversationId: getUuidByString("6035673625"),
        payload: { text: "hello again" },
        schedule:{ dateTime: dateTime},
        tags: { "telegramtest:id": `${randomUUID()}` },
    })
}
