extends Node

# Save file path
const SAVE_FILE = "user://save_game.json"

func _init() -> void:
	print("SaveManager initialized")

func save_game(data: Dictionary) -> Error:
	var json_string = JSON.stringify(data)
	var file = FileAccess.open(SAVE_FILE, FileAccess.WRITE)
	if file == null:
		push_error("Cannot open file for writing: %s" % SAVE_FILE)
		return FAILED
	
	var result = file.store_string(json_string)
	file.close()
	return result

func load_game() -> Dictionary:
	var file = FileAccess.open(SAVE_FILE, FileAccess.READ)
	if file == null:
		push_error("Cannot open file for reading: %s" % SAVE_FILE)
		return {}
	
	var json_string = file.get_as_text()
	file.close()
	
	var result = JSON.parse_string(json_string)
	if result.error != OK:
		push_error("Failed to parse save data: %s" % result.error_string)
		return {}
	
	return result.result

func save_exists() -> bool:
	return FileAccess.file_exists(SAVE_FILE)

func delete_save() -> Error:
	var file = FileAccess.open(SAVE_FILE, FileAccess.WRITE)
	if file == null:
		push_error("Cannot open file for writing: %s" % SAVE_FILE)
		return FAILED
	file.store_string("{}")
	file.close()
	return OK
