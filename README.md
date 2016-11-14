# chat-app

Test project (for learning) . Chat application based on express and express-ws.


For allow http in gcloud use:
gcloud compute firewall-rules create allow-http --description "incoming http allowed" --allow tcp:80
wss (secured websocket) not working on app engine, so u need use http, not https
