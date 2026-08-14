extends Control

# References to UI elements
@onready var money_label: Label = $MoneyLabel
@onready var energy_label: Label = $EnergyLabel
@onready var hunger_label: Label = $HungerLabel
@onready var happiness_label: Label = $HappinessLabel
@onready var level_label: Label = $LevelLabel
@onready var xp_label: Label = $XPLabel

# References to managers
var game_manager
var formatter

func _ready() -> void:
	# Initialize formatter - use the node directly
	formatter = $Formatter
	update_ui()

func _on_click_button_pressed() -> void:
	if game_manager && game_manager.character:
		game_manager.character.money += 10
		game_manager.character.happiness += 1
		update_ui()
		game_manager.add_xp(5)

func update_ui() -> void:
	if game_manager && game_manager.character:
		var char = game_manager.character
		if formatter:
			money_label.text = formatter.format_currency(int(char.money))
		else:
			money_label.text = "$%d" % int(char.money)
		energy_label.text = "Energia: %d%%" % int(char.energy)
		hunger_label.text = "Fome: %d%%" % int(char.hunger)
		happiness_label.text = "Felicidade: %d%%" % int(char.happiness)
	
	if game_manager:
		level_label.text = "Nível: %d" % game_manager.player_level
		xp_label.text = "XP: %d/%d" % [game_manager.player_xp, game_manager.player_level * 100]

func set_game_manager(manager) -> void:
	game_manager = manager
	update_ui()
