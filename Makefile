.PHONY: deploy deploy-backend deploy-frontend clean

all: deploy

deploy-backend: 
	dfx deploy react_demo_backend

deploy-frontend:
	npm install
	dfx generate react_demo_frontend
	npm run dev

clean:
	rm -rf .dfx
	rm -rf dist
	rm -rf node_modules
	rm -rf src/declarations
	rm -f .env
	cargo clean
