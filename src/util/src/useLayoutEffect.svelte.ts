/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const useLayoutEffectImpl = (a: () => void, b?: any) => {
	$effect(a);
};

export default useLayoutEffectImpl;
