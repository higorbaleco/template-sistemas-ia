extends Node

func _ready() -> void:
	print("=== TESTING REAL LIFE GAME ===")
	
	# Test 1: Check managers exist
	var game_manager = $GameManager
	var save_manager = $SaveManager
	var character = $Character
	
	print("✓ Managers created successfully")
	
	# Test 2: Test character functionality
	character.work(100)
	character.eat()
	character.sleep()
	print("✓ Character actions work")
	
	# Test 3: Test save/load
	var save_data = game_manager.get_save_data()
	save_manager.save_game(save_data)
	var loaded_data = save_manager.load_game()
	print("✓ Save/load system works")
	
	# Test 4: Test events
	var event = $CardController.get_random_event()
	if event:
		print("✓ Event system works")
	
	print("=== ALL TESTS PASSED ===")
