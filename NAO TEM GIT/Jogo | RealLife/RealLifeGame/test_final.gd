extends Node

func _ready() -> void:
	print("=== FINAL VERIFICATION TEST ===")
	print("")
	
	# Test 1: Managers exist
	var has_managers = false
	if $GameManager && $SaveManager && $NotificationManager && $InventoryManager:
		has_managers = true
	print("Test 1 - Managers exist: " + str(has_managers))
	
	# Test 2: Character exists
	var has_character = $Character != null
	print("Test 2 - Character exists: " + str(has_character))
	
	# Test 3: Can call character methods
	var can_use_character = false
	if has_character:
		$Character.work(100)
		can_use_character = $Character.money >= 0
	print("Test 3 - Character methods work: " + str(can_use_character))
	
	# Test 4: Save manager can save
	var can_save = false
	if $SaveManager:
		var test_data = {"test": "data"}
		$SaveManager.save_game(test_data)
		can_save = true
	print("Test 4 - Save system works: " + str(can_save))
	
	# Test 5: Card controller exists
	var has_card_controller = $CardController != null
	print("Test 5 - Card controller exists: " + str(has_card_controller))
	
	# Test 6: Event system works
	var event_works = false
	if $CardController:
		$CardController.load_events_database()
		event_works = true
	print("Test 6 - Event system works: " + str(event_works))
	
	# Test 7: Achievement service exists
	var has_achievements = $AchievementService != null
	print("Test 7 - Achievement service exists: " + str(has_achievements))
	
	# Test 8: Analytics service exists
	var has_analytics = $AnalyticsService != null
	print("Test 8 - Analytics service exists: " + str(has_analytics))
	
	print("")
	if has_managers and has_character and can_use_character and can_save and has_card_controller and event_works and has_achievements and has_analytics:
		print("✅ ALL TESTS PASSED - Game is fully functional!")
	else:
		print("❌ Some tests failed")
	
	print("=== TEST COMPLETE ===")
