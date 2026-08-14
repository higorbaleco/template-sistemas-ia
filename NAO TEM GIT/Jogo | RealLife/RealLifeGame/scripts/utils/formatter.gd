extends Node

# Utility functions for formatting numbers, dates, etc.

func format_number(number: int) -> String:
	if number >= 1_000_000_000:
		return "%.1fB" % (number / 1_000_000_000.0)
	elif number >= 1_000_000:
		return "%.1fM" % (number / 1_000_000.0)
	elif number >= 1_000:
		return "%.1fK" % (number / 1_000.0)
	else:
		return "%d" % number

func format_currency(amount: int) -> String:
	return "$%s" % format_number(amount)

func format_percentage(value: float) -> String:
	return "%.1f%%" % (value * 100.0)

func format_time(seconds: float) -> String:
	var days = floor(seconds / 86400)
	var hours = floor((seconds % 86400) / 3600)
	var minutes = floor((seconds % 3600) / 60)
	var secs = floor(seconds % 60)
	
	if days > 0:
		return "%dd %dh %dm" % [days, hours, minutes]
	elif hours > 0:
		return "%dh %dm" % [hours, minutes]
	elif minutes > 0:
		return "%dm %ds" % [minutes, secs]
	else:
		return "%ds" % [secs]
