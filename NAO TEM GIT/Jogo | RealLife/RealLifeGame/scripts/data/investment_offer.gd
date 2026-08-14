extends Node

# Investment offer data structure
var investment_name: String
var investment_type: String
var min_amount: int
var max_amount: int
var expected_return_min: float
var expected_return_max: float
var risk_level: float
var liquidity: float
var description: String
var is_high_risk: bool

func _init(name: String, type: String, min_amt: int, max_amt: int, return_min: float, return_max: float, risk: float, liquidity_val: float, desc: String) -> void:
	investment_name = name
	investment_type = type
	min_amount = min_amt
	max_amount = max_amt
	expected_return_min = return_min
	expected_return_max = return_max
	risk_level = risk
	liquidity = liquidity_val
	description = desc
	is_high_risk = risk > 0.7

func get_return_range() -> String:
	return "%.1f%% - %.1f%%" % [expected_return_min * 100, expected_return_max * 100]

func get_risk_level_text() -> String:
	match risk_level:
		0.0..0.3:
			return "Low Risk"
		0.3..0.6:
			return "Medium Risk"
		_:
			return "High Risk"
