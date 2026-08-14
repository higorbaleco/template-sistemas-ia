extends Node

# Signal definitions
signal navigation_changed(screen_name)

# Current active tab
var active_tab: String = "career"

# References to buttons (will be set by the UI)
var career_button: Button
var finances_button: Button
var business_button: Button
var events_button: Button
var more_button: Button

func _ready() -> void:
	# Connect button signals if references are set
	if career_button:
		career_button.pressed.connect(_on_career_pressed)
	if finances_button:
		finances_button.pressed.connect(_on_finances_pressed)
	if business_button:
		business_button.pressed.connect(_on_business_pressed)
	if events_button:
		events_button.pressed.connect(_on_events_pressed)
	if more_button:
		more_button.pressed.connect(_on_more_pressed)

func set_active_tab(tab_name: String) -> void:
	active_tab = tab_name
	_update_button_appearance()
	emit_signal("navigation_changed", tab_name)

func _on_career_pressed() -> void:
	set_active_tab("career")

func _on_finances_pressed() -> void:
	set_active_tab("finances")

func _on_business_pressed() -> void:
	set_active_tab("business")

func _on_events_pressed() -> void:
	set_active_tab("events")

func _on_more_pressed() -> void:
	set_active_tab("more")

func _update_button_appearance() -> void:
	# This would typically change the appearance of the active button
	# For now, we just print
	print("Active tab changed to: %s" % active_tab)
	# In a full implementation, we would modify the button's appearance (e.g., change color, add underline)
