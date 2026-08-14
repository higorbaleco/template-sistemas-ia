extends Node

# Signals
signal decision_made(option_index: int)  # 0 for option A, 1 for option B

# Current card data
var current_card: Dictionary

# Reference to the decision card UI (will be set externally)
var decision_card: Control

# Event database (will be loaded from resources)
var events_database: Array

func _init() -> void:
	print("CardController initialized")
	# We'll load the events database later, for now use empty array
	events_database = []

func load_events_database() -> void:
	# In a real implementation, we would load from resources/databases/events_database.tres
	# For now, we'll create some sample events
	events_database = [
		{
			"id": 1,
			"title": "Oferta de Emprego",
			"description": "Você recebeu uma oferta de emprego em uma empresa respeitável. O salário é bom, mas exige longas horas de trabalho.",
			"option_a": "Aceitar o emprego",
			"option_b": "Recusar e continuar procurando",
			"outcomes": {
				"a": {"money": 500, "happiness": -10, "energy": -20},
				"b": {"money": 0, "happiness": 5, "energy": 0}
			}
		},
		{
			"id": 2,
			"title": "Investimento em Ações",
			"description": "Um amigo sugeriu investir em uma ação que está em alta. Há potencial de lucro, mas também risco de perda.",
			"option_a": "Investir $100",
			"option_b": "Não investir e guardar o dinheiro",
			"outcomes": {
				"a": {"money": -100, "potential_gain": 150, "risk": 0.3},  # 30% chance of loss
				"b": {"money": 0, "potential_gain": 0, "risk": 0}
			}
		}
	]
	print("Loaded %d events" % events_database.size())

func get_random_event() -> Dictionary:
	if events_database.size() == 0:
		load_events_database()
	var index = randi() % events_database.size()
	return events_database[index].duplicate()  # Return a copy

func show_event(card_data: Dictionary) -> void:
	current_card = card_data
	# Update the UI if the decision card reference is set
	if decision_card:
		# We assume the decision_card has methods to update its UI
		# For now, we just print
		print("Showing event: %s" % current_card.title)
		# In a full implementation, we would update the labels and buttons in the decision_card scene
		# Example:
		# decision_card.get_node("TitleLabel").text = current_card.title
		# decision_card.get_node("DescriptionLabel").text = current_card.description
		# decision_card.get_node("OptionA").text = current_card.option_a
		# decision_card.get_node("OptionB").text = current_card.option_b

func on_option_a_pressed() -> void:
	if current_card:
		emit_signal("decision_made", 0)
		# Apply outcomes for option A
		_apply_outcomes(current_card.outcomes.a)
		# Clear current card
		current_card = {}
		# Optionally, hide the card or show next one after delay

func on_option_b_pressed() -> void:
	if current_card:
		emit_signal("decision_made", 1)
		# Apply outcomes for option B
		_apply_outcomes(current_card.outcomes.b)
		# Clear current card
		current_card = {}

func _apply_outcomes(outcomes: Dictionary) -> void:
	# This would typically call the game manager or other systems to apply the effects
	# For now, we just print
	print("Applying outcomes: %s" % outcomes)
	# Example: if we had a reference to the game manager, we would do:
	# game_manager.add_money(outcomes.get("money", 0))
	# game_manager.character.happiness += outcomes.get("happiness", 0)
	# etc.
