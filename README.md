Description

NOTIONMAIL-CLI is a command-line tool that enables users to send and receive messages through a Notion database. This application allows users to create, read, and manage messages with a simple text-based interface. It provides a seamless way to interact with Notion without needing to open the Notion app or website.

Features
-Send Messages: Input a sender, recipient, and message to store it in the Notion database.
-Read Messages: View all messages where you are the recipient.
-Timestamps: View when messages where sent

Additional Improvements for future:
-Message Threading: Allows messages to be linked as replies, enabling a conversational structure.
-Read/unread: View if a message has been read or not read.
-Message Deletion: Users can remove messages when needed.
-Search Mail: Implement search functionality to find messages by sender, recipient, or keywords.

Installation & Running the Program

Prerequisites
Ensure you have the following installed:
Node.js (v14+ recommended)
npm (Node Package Manager)

Installation Steps
Clone this repository:
git clone https://github.com/yourusername/notionmail-cli.git
cd notionmail-cli

Install dependencies:
npm install
Set up environment variables:
Create a .env file in the root directory.
Add your Notion API Key and Database ID:

NOTION_API_KEY=your_secret_api_key
DATABASE_ID=your_notion_database_id

Running the Program
To start using NotionMail CLI, run the following command:
node index.js

You'll be prompted to enter details to send or read messages.

References & Resources
-Notion API Documentation
-Node.js File System
-Inquirer.js for CLI Interactions
-Stack Overflow Discussions on Node CLI Apps

What were some of the product or technical choices you made and why?

Library Selections:

- Inquirer: Used for interactive CLI prompts. Its simplicity in gathering user input and validation fits our needs perfectly.
-Nanospinner: These packages provide visual feedback during asynchronous operations (such as fetching data from Notion), improving the user experience by indicating that the program is working in the background.
-dotenv: For securely managing configuration and sensitive keys (like the Notion API key) via a .env file.

Handling Missing or Nonexistent Data:

-No Messages Found:
If a user requests to read messages and there are no messages that match the specified recipient it displays a user-friendly message (e.g.: “No messages found for this user.”) instead of crashing or returning undefined data.

-API Errors and Invalid Data:
All API calls are wrapped in try/catch blocks to gracefully handle errors. In the event of an error the program logs an informative error message and stops the spinner so that users understand something went wrong.

-Input Validation:
Each CLI prompt includes validation (using Inquirer’s validate function) to ensure that users do not submit empty or invalid data. This minimizes errors early on in the data entry process and prevents unnecessary API calls with bad data.
