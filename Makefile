.PHONY: dev

dev:
	concurrently "fastapi dev server/app.py" "cd ./gui && npm run tauri dev"