extends Node

# Achievement tracking system
signal achievement_unlocked(achievement_id, title, description)

var achievements: Dictionary = {}
var unlocked_achievements: Array = []

func _init() -> void:
	print("AchievementService initialized")
	# Define available achievements
	achievements = {
		"first_click": {"title": "First Click", "description": "Get your first $10", "unlocked": false},
		"wealthy": {"title": "Wealthy", "description": "Reach $10,000", "unlocked": false},
		"investor": {"title": "Investor", "description": "Make your first investment", "unlocked": false},
		"career_changer": {"title": "Career Changer", "description": "Get a job offer", "unlocked": false},
		"risk_taker": {"title": "Risk Taker", "description": "Take a high-risk investment", "unlocked": false},
		"lucky": {"title": "Lucky", "description": "Get a positive event outcome", "unlocked": false},
		"persistent": {"title": "Persistent", "description": "Play for 1 hour", "unlocked": false},
		"social": {"title": "Social", "description": "Share your success", "unlocked": false}
	}

func unlock_achievement(achievement_id: String) -> void:
	if achievements.has(achievement_id) and !achievements[achievement_id]["unlocked"]:
		achievements[achievement_id]["unlocked"] = true
		unlocked_achievements.append(achievement_id)
		var title = achievements[achievement_id]["title"]
		var description = achievements[achievement_id]["description"]
		emit_signal("achievement_unlocked", achievement_id, title, description)
		print("Achievement unlocked: %s - %s" % [title, description])

func is_achievement_unlocked(achievement_id: String) -> bool:
	return achievements.get(achievement_id, {"unlocked": false})["unlocked"]

func get_achievement_progress() -> Dictionary:
	var total = achievements.size()
	var unlocked = unlocked_achievements.size()
	var percentage = 0.0
	if total > 0:
		percentage = float(unlocked) / float(total) * 100.0
	return {"total": total, "unlocked": unlocked, "percentage": percentage}

func reset_achievements() -> void:
	for achievement_id in achievements.keys():
		achievements[achievement_id]["unlocked"] = false
	unlocked_achievements.clear()
	print("All achievements reset")
