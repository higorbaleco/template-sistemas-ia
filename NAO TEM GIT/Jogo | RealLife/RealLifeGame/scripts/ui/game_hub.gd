extends Control

# Game hub controller
@onready var bottom_nav = $BottomNavigation
@onready var main_content = $MainContent

var current_tab: String = "career"

func _ready() -> void:
	print("GameHub initialized")
	# Initialize with career tab active
	set_tab("career")

func set_tab(tab_name: String) -> void:
	current_tab = tab_name
	# Show appropriate content
	match tab_name:
		"career":
			show_career_tab()
		"finances":
			show_finances_tab()
		"business":
			show_business_tab()
		"events":
			show_events_tab()
		"more":
			show_more_tab()

func show_career_tab() -> void:
	print("Showing career tab")
	# Load career-related UI

func show_finances_tab() -> void:
	print("Showing finances tab")
	# Load finances-related UI

func show_business_tab() -> void:
	print("Showing business tab")
	# Load business-related UI

func show_events_tab() -> void:
	print("Showing events tab")
	# Load events-related UI

func show_more_tab() -> void:
	print("Showing more tab")
	# Load more options UI
