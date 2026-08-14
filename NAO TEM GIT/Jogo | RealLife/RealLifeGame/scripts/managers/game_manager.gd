extends Node

# Game manager singleton
var singleton = null

func _init() -> void:
	singleton = self
	print("GameManager initialized")

func _ready() -> void:
	# Initialize game state
	print("Game ready")
