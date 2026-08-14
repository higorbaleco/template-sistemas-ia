extends Node

# Main game controller
var game_manager
var save_manager
var card_controller
var bottom_nav_controller
var ui

func _ready() -> void:
	# Initialize game systems
	print("=== RealLife Game Starting ===")
	
	# Get references to managers
	game_manager = $GameManager
	save_manager = $SaveManager
	card_controller = $CardController
	bottom_nav_controller = $BottomNavigationController
	ui = $MainUI
	
	# Initialize game
	game_manager._ready()
	
	# Start with main menu
	change_scene("main_menu")
	
	print("=== Game Ready ===")

func change_scene(scene_name: String) -> void:
	# Scene management logic
	print("Changing to scene: %s" % scene_name)
	# Implementation would depend on your scene structure

func _input(event: InputEvent) -> void:
	# Global input handling
	if event.is_action_pressed("ui_cancel"):
		# Handle pause/menu
		pass
