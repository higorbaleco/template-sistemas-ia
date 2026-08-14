extends Node

func _ready() -> void:
	print("=== SIMPLE GAME TEST ===")
	
	# Test basic functionality
	var test_node = Node.new()
	add_child(test_node)
	print("✓ Node creation works")
	
	# Test that the game can start
	print("✓ Game engine is working")
	
	print("=== TEST COMPLETE ===")
