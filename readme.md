## Settings
### this projects has starte with the next command:
npm init -y
npm install --save-dev typescript
npx tsc --init
### we need update in the compiler options object with the netx atributes : the file tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,  
    "strict": true,
    "skipLibCheck": true
  }
}

### we install :
npm install express
npm install --save-dev @types/express @types/node @types/cors
npm install touch-cli -g 
mkdir src
touch src/server.ts


##### for build project use:  npm run build
##### for start the project use : npm start

#### for tests in postman use the next steps:
##### 1.- Open Postman: Launch the Postman application.
##### 2.- Create a New Request: Set up a new request in Postman by specifying the request type GET and the endpoint URL http://localhost:3000
##### 3.- Send the Request: Hit send and view the response from your server.
##### 4.- Analyze the Response: Check the status code, response body, and headers to ensure your API behaves correctly.


### dont forget this:
`````The dist folder is the directory where TypeScript transpiles the .ts files into .js files. The dist folder and server.js are generated after running the npm run build command, which compiles the TypeScript code to JavaScript as per the configuration in tsconfig.json. This folder is not directly created or modified by the developer; it's managed through the build process controlled by the TypeScript compiler. `````

`````That’s the complete guide to setting up a Node.js project with TypeScript. This setup gives you a strong foundation for building robust and maintainable server-side applications.`````

## for create tables with prisma: npx prisma generate 
## then: npx prisma migrate dev --name init
## for execute typescript compilator in watch mode: open a new terminal in folder project and paste command: tsc --watch 