extends Node

# Analytics tracking for game metrics
var session_start_time: float = 0.0
var total_play_time: float = 0.0
var actions_count: Dictionary = {}
var money_earned: float = 0.0
var money_spent: float = 0.0

func _init() -> void:
	print("AnalyticsService initialized")

func start_session() -> void:
	session_start_time = Time.get_ticks_msec()
	print("Analytics session started")

func end_session() -> void:
	var end_time = Time.get_ticks_msec()
	total_play_time = (end_time - session_start_time) / 1000.0
	print("Session ended. Total play time: %.1f seconds" % total_play_time)

func track_action(action_name: String) -> void:
	if actions_count.has(action_name):
		actions_count[action_name] += 1
	else:
		actions_count[action_name] = 1
	print("Action tracked: %s" % action_name)

func track_money_earned(amount: float) -> void:
	money_earned += amount
	print("Money earned: $%.2f (Total: $%.2f)" % [amount, money_earned])

func track_money_spent(amount: float) -> void:
	money_spent += amount
	print("Money spent: $%.2f (Total: $%.2f)" % [amount, money_spent])

func get_session_summary() -> Dictionary:
	return {
		"play_time_seconds": total_play_time,
		"total_actions": actions_count.values().reduce(func(a, b): return a + b, 0),
		"money_earned": money_earned,
		"money_spent": money_spent,
		"net_money": money_earned - money_spent,
		"actions_breakdown": actions_count.duplicate()
	}

func reset_analytics() -> void:
	session_start_time = 0.0
	total_play_time = 0.0
	actions_count.clear()
	money_earned = 0.0
	money_spent = 0.0
	print("Analytics reset")
