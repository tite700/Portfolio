<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, Gizmo, type GizmoOptions } from '@threlte/extras';
</script>

<T.PerspectiveCamera makeDefault position={[5, 5, 5]}>
	<OrbitControls />
	<Gizmo />
</T.PerspectiveCamera>
<T.Mesh position={[0, 0, 0]}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshBasicMaterial color="red" />
</T.Mesh>

<T.Mesh position={[0, 0, -2]} rotation={[Math.PI, 0, 0]}>
	<T.PlaneGeometry args={[10, 10]} />
	<T.MeshBasicMaterial color="grey" />
</T.Mesh>
