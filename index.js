#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;



welcome();
askSendOrRead();

async function welcome(){
    console.log(chalk.bgGrey("Hi, Welcome to NotionMail!"));
    // console.log(`Please select an option:
    //     - send: Send mail to a user.
    //     - read: Check a user's mail.`);
}


async function askSendOrRead(){
    let answers = await inquirer.prompt({
        name: 'userInstruction',
        type: 'list',
        message: 'Please select an option:',
        choices: [ "Send mail to a user",
        "Check a user's mail",
        ],

    });

    if((answers.userInstruction) == "Send mail to a user"){
        return handleSend();
    } else if ((answers.userInstruction) == "Check a user's mail"){
        return handleRead();
    }
}

async function handleSend() {
    let senderInfo = await inquirer.prompt({
        name: 'sender',
        type: 'input',
        message: 'Sender:' ,
        validate: input => input.trim() !== '' ? true : 'Sender cannot be empty!'
    });

    let recipientInfo = await inquirer.prompt({
        name: 'recipient',
        type: 'input',
        message: 'Recipient: ',
        validate: input => input.trim() !== '' ? true : 'Recipient cannot be empty!'

    });

    let messageInfo = await inquirer.prompt({
        name: 'message',
        type: 'input',
        message: 'Message: ',
        validate: input => input.trim() !== '' ? true : 'Message cannot be empty!'

    });

    const spinner = createSpinner('sending message...').start();

    try{
        let response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
            Message: { title: [{ text: { content: messageInfo.message } }] },
            Sender: { rich_text: [{ text: { content: senderInfo.sender } }] },
            Recipient: { rich_text: [{ text: { content: recipientInfo.recipient } }] },
            Timestamp: { date: { start: new Date().toISOString() } }
        }

    });
    
        if(response.id){
            spinner.success({ text: "Message sent successfully! ✅"});
        } else {
            spinner.error({ text: "Failed to send message. ❌"});
            process.exit(1);
        }

    } catch(error) {
        console.error(chalk.red("Error sending message:", error.message));
    }
}


async function handleRead() {
    let userInfo = await inquirer.prompt({
        name: 'User',
        type: 'input',
        message: 'User: ',
        validate: input => input.trim() !== '' ? true : 'user cannot be empty!'

    });

    const spinner = createSpinner("Fetching messages...").start();

    try{
        let response = await notion.databases.query({
            database_id: databaseId,
        });



        if(response.results.length === 0){
            spinner.stop();
            console.log("No messages found.");
            return;
        }

        response.results.forEach((page) => {
            spinner.stop();
            let messageProp = page.properties.Message;
            let senderProp = page.properties.Sender;
            let recipientProp = page.properties.Recipient;
            let timestampProp = page.properties.Timestamp;

            let message = messageProp.title[0].plain_text;
            let sender = senderProp.rich_text[0].plain_text;
            let recipient = recipientProp.rich_text[0].plain_text;
            let timestamp = timestampProp.date.start;
            // console.log(`Checking: ${userInfo.User} vs. ${recipient}`);

            if (userInfo.User.trim().toLowerCase() === recipient.trim().toLowerCase()) {
                console.log("-----");
                console.log(`Message: ${message}`);
                console.log(`From: ${sender}`);
                console.log(`To: ${recipient}`);
                console.log(`At: ${timestamp}`);
            }

        });
    
    }catch(error){
        console.error("Error reading from database:", error.message);
    }
}

