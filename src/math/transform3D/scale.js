// 在设置的中心点缩放指定倍速
clay.math.scale = function () {

	var scope = {};

	// 根据缩放比例返回缩放后位置
	// flag表示是否把这次缩放后位置标记为下次缩放开始位置
	var scale = function (m, flag) {

		if (scope.C && scope.P) {
			if (typeof m !== 'number') throw new Error('Unsupported data!');
			var temp = [
				m * (scope.P[0] - scope.C[0]) + scope.C[0],
				m * (scope.P[1] - scope.C[1]) + scope.C[1],
				m * (scope.P[2] - scope.C[2]) + scope.C[2]
			];
			// 如果flag为true，标记为下次缩放开始位置
			if (flag) {
				scope.P = temp;
				return scale;
			}
			return temp;
		} else {
			throw new Error('You shoud first set the center and position!');
		}

	};

	// 设置缩放中心
	scale.setC = function (a, b, c) {

		if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Unsupported data!');
		if (typeof c !== 'number') c = 0;
		scope.C = [a, b, c];
		return scale;

	};

	// 设置点最初的位置
	scale.setP = function (x, y, z) {

		if (typeof x !== 'number' || typeof y !== 'number') throw new Error('Unsupported data!');
		if (typeof z !== 'number') z = 0;
		scope.P = [x, y, z];
		return scale;

	};

	return scale;

};
