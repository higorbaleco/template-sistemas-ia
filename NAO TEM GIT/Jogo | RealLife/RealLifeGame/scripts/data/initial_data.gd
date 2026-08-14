extends Node

# Initial game data setup
func _ready() -> void:
	print("Loading initial game data...")
	_load_jobs_database()
	_load_investments_database()
	_load_events_database()
	print("Initial data loaded successfully!")

func _load_jobs_database() -> void:
	var jobs_db = load("res://resources/databases/jobs_database.tres")
	if jobs_db:
		print("Jobs database loaded: %d positions" % jobs_db.jobs.size())
	else:
		print("Warning: Could not load jobs database")

func _load_investments_database() -> void:
	var investments_db = load("res://resources/databases/investment_types.tres")
	if investments_db:
		print("Investments database loaded: %d types" % investments_db.investments.size())
	else:
		print("Warning: Could not load investments database")

func _load_events_database() -> void:
	var events_db = load("res://resources/databases/events_database.tres")
	if events_db:
		print("Events database loaded: %d events" % events_db.events.size())
	else:
		print("Warning: Could not load events database")

# Helper function to get random event
func get_random_event() -> Dictionary:
	var events_db = load("res://resources/databases/events_database.tres")
	if events_db && events_db.events.size() > 0:
		var index = randi() % events_db.events.size()
		return events_db.events[index].duplicate()
	return {}

# Helper function to get random job
func get_random_job() -> Dictionary:
	var jobs_db = load("res://resources/databases/jobs_database.tres")
	if jobs_db && jobs_db.jobs.size() > 0:
		var index = randi() % jobs_db.jobs.size()
		return jobs_db.jobs[index].duplicate()
	return {}
