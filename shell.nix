{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShellNoCC {
	buildInputs = with pkgs; [
		nodejs_23
		openssl
		nodePackages_latest.prisma
	];

	shellHook = ''
		export PATH="./node_modules/bin:$PATH"
	'';

	env = {
		PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
		PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
		PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
	};
}

