import actionscript from "highlight.js/lib/languages/actionscript";
import apacheconf from "highlight.js/lib/languages/apache";
import applescript from "highlight.js/lib/languages/applescript";
import basic from "highlight.js/lib/languages/basic";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import coffeescript from "highlight.js/lib/languages/coffeescript";
import cmake from "highlight.js/lib/languages/cmake";
import clojure from "highlight.js/lib/languages/clojure";
import crystal from "highlight.js/lib/languages/crystal";
import css from "highlight.js/lib/languages/css";
import d from "highlight.js/lib/languages/d";
import django from "highlight.js/lib/languages/django";
import docker from "highlight.js/lib/languages/dockerfile";
import elixir from "highlight.js/lib/languages/elixir";
import elm from "highlight.js/lib/languages/elm";
import erlang from "highlight.js/lib/languages/erlang";
import fsharp from "highlight.js/lib/languages/fsharp";
import fortran from "highlight.js/lib/languages/fortran";
import go from "highlight.js/lib/languages/go";
import groovy from "highlight.js/lib/languages/groovy";
import handlebars from "highlight.js/lib/languages/handlebars";
import haskell from "highlight.js/lib/languages/haskell";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import julia from "highlight.js/lib/languages/julia";
import kotlin from "highlight.js/lib/languages/kotlin";
import less from "highlight.js/lib/languages/less";
import lisp from "highlight.js/lib/languages/lisp";
import lua from "highlight.js/lib/languages/lua";
import makefile from "highlight.js/lib/languages/makefile";
import markdown from "highlight.js/lib/languages/markdown";
import matlab from "highlight.js/lib/languages/matlab";
import nginx from "highlight.js/lib/languages/nginx";
import objectivec from "highlight.js/lib/languages/objectivec";
import ocaml from "highlight.js/lib/languages/ocaml";
import perl from "highlight.js/lib/languages/perl";
import php from "highlight.js/lib/languages/php";
import powershell from "highlight.js/lib/languages/powershell";
import protobuf from "highlight.js/lib/languages/protobuf";
import python from "highlight.js/lib/languages/python";
import r from "highlight.js/lib/languages/r";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import scala from "highlight.js/lib/languages/scala";
import scss from "highlight.js/lib/languages/scss";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import plaintext from "highlight.js/lib/languages/plaintext";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

export const languages = {
  actionscript: {
    aliases: ["actionscript 3", "actionscript3", "as3"],
    name: "ActionScript",
    extensions: [".as"],
    mapping: actionscript,
  },
  apacheconf: {
    aliases: ["aconf", "apache"],
    name: "Apache Configuration",
    extensions: [".apacheconf", ".vhost"],
    filenames: [".htaccess", "apache2.conf", "httpd.conf"],
    mapping: apacheconf,
  },
  applescript: {
    aliases: ["osascript"],
    name: "AppleScript",
    extensions: [".applescript", ".scpt"],
    mapping: applescript,
  },
  basic: {
    aliases: ["vba", "vb6", "visual-basic"],
    name: "BASIC",
    extensions: [".bas", ".vba"],
    mapping: basic,
  },
  c: {
    name: "C",
    extensions: [".c", ".cats", ".h", ".idc"],
    mapping: c,
  },
  csharp: {
    aliases: ["cs", "dotnet"],
    name: "C#",
    extensions: [".cs", ".csx"],
    mapping: csharp,
  },
  cpp: {
    aliases: ["cplusplus"],
    name: "C++",
    extensions: [
      ".cpp",
      ".c++",
      ".cc",
      ".cp",
      ".cxx",
      ".h",
      ".h++",
      ".hpp",
      ".hxx",
    ],
    mapping: cpp,
  },
  coffeescript: {
    aliases: ["coffee", "coffee-script"],
    name: "CoffeeScript",
    extensions: [".coffee"],
    mapping: coffeescript,
  },
  cmake: {
    name: "CMake",
    extensions: [".cmake", ".cmake.in"],
    filenames: ["CMakeLists.txt"],
    mapping: cmake,
  },
  clojure: {
    name: "Clojure",
    extensions: [
      ".clj",
      ".cl2",
      ".cljc",
      ".cljs",
      ".cljs.hl",
      ".cljscm",
      ".cljx",
    ],
    filenames: ["riemann.config"],
    mapping: clojure,
  },
  crystal: {
    name: "Crystal",
    extensions: [".cr"],
    mapping: crystal,
  },
  css: {
    name: "CSS",
    extensions: [".css"],
    mapping: css,
  },
  d: {
    name: "D",
    extensions: [".d", ".di"],
    mapping: d,
  },
  django: {
    aliases: ["jinja", "jinja2"],
    name: "Django/Jinja2",
    extensions: [".jinja", ".jinja2"],
    mapping: django,
  },
  docker: {
    aliases: ["dockerfile"],
    name: "Docker",
    extensions: [".dockerfile"],
    filenames: ["Dockerfile"],
    mapping: docker,
  },
  elixir: {
    name: "Elixir",
    extensions: [".ex", ".exs"],
    mapping: elixir,
  },
  elm: {
    name: "Elm",
    extensions: [".elm"],
    mapping: elm,
  },
  erlang: {
    name: "Erlang",
    extensions: [".erl", ".es", ".escript", ".hrl", ".xrl", ".yrl"],
    filenames: ["Emakefile", "rebar.config", "rebar.config.lock", "rebar.lock"],
    mapping: erlang,
  },
  fsharp: {
    name: "F#",
    extensions: [".fs", ".fsi", ".fsx"],
    mapping: fsharp,
  },
  fortran: {
    name: "Fortran",
    extensions: [".f90", ".f", ".f03", ".f08", ".f77", ".f95", ".for", ".fpp"],
    mapping: fortran,
  },
  go: {
    aliases: ["golang"],
    name: "Go",
    extensions: [".go"],
    mapping: go,
  },
  groovy: {
    name: "Groovy",
    extensions: [".groovy", ".grt", ".gtpl", ".gvy"],
    filenames: ["Jenkinsfile"],
    mapping: groovy,
  },
  handlebars: {
    aliases: ["hbs", "htmlbars"],
    name: "Handlebars",
    extensions: [".handlebars", ".hbs"],
    mapping: handlebars,
  },
  haskell: {
    aliases: ["hs"],
    name: "Haskell",
    extensions: [".hs", ".hs-boot", ".hsc"],
    mapping: haskell,
  },
  html: {
    aliases: ["xhtml"],
    name: "HTML",
    extensions: [".html", ".htm", ".html.hl", ".xht", ".xhtml"],
    mapping: xml,
  },
  java: {
    name: "Java",
    extensions: [".java"],
    mapping: java,
  },
  javascript: {
    aliases: ["js", "node"],
    name: "JavaScript",
    extensions: [".js", ".cjs", ".es", ".es6"],
    filenames: ["Jakefile"],
    mapping: javascript,
  },
  json: {
    name: "JSON",
    extensions: [".json"],
    mapping: json,
  },
  jsx: {
    name: "React JSX",
    extensions: [".jsx"],
    mapping: javascript,
  },
  julia: {
    name: "Julia",
    extensions: [".jl"],
    mapping: julia,
  },
  kotlin: {
    name: "Kotlin",
    extensions: [".kt", ".ktm", ".kts"],
    mapping: kotlin,
  },
  less: {
    name: "Less",
    extensions: [".less"],
    mapping: less,
  },
  lisp: {
    aliases: ["emacs", "elisp", "emacs-lisp"],
    name: "Lisp",
    extensions: [".lisp", ".lsp", ".emacs", ".el"],
    mapping: lisp,
  },
  lua: {
    name: "Lua",
    extensions: [".lua", ".fcgi", ".nse"],
    filenames: [".luacheckrc"],
    mapping: lua,
  },
  makefile: {
    aliases: ["make"],
    name: "Makefile",
    extensions: [".make"],
    filenames: ["Makefile"],
    mapping: makefile,
  },
  markdown: {
    aliases: ["md", "pandoc"],
    name: "Markdown",
    extensions: [".md", ".markdown", ".mdx"],
    mapping: markdown,
  },
  matlab: {
    aliases: ["octave"],
    name: "Matlab",
    extensions: [".m", ".matlab"],
    mapping: matlab,
  },
  nginx: {
    name: "Nginx Configuration",
    filenames: ["nginx.conf"],
    mapping: nginx,
  },
  objectivec: {
    aliases: ["objc", "obj-c"],
    name: "Objective-C",
    extensions: [".m", ".h"],
    mapping: objectivec,
  },
  ocaml: {
    name: "OCaml",
    extensions: [".ml"],
    mapping: ocaml,
  },
  perl: {
    aliases: ["cperl"],
    name: "Perl",
    extensions: [".pl", ".ph"],
    filenames: ["cpanfile", "Rexfile"],
    mapping: perl,
  },
  php: {
    name: "PHP",
    extensions: [".php"],
    mapping: php,
  },
  powershell: {
    name: "PowerShell",
    extensions: [".ps1", ".psd1", ".psm1"],
    mapping: powershell,
  },
  protobuf: {
    name: "Protocol Buffers",
    extensions: [".proto"],
    mapping: protobuf,
  },
  python: {
    aliases: ["py"],
    name: "Python",
    extensions: [".py"],
    mapping: python,
  },
  r: {
    aliases: ["rscript"],
    name: "R",
    extensions: [".r", ".rd", ".rsx"],
    mapping: r,
  },
  ruby: {
    aliases: ["rb", "jruby", "rake"],
    name: "Ruby",
    extensions: [".rb", ".ruby", ".mspec", ".rake", ".spec", ".gemspec"],
    filenames: [
      ".irbrc",
      ".pryrc",
      "Brewfile",
      "Buildfile",
      "Gemfile",
      "Gemfile.lock",
      "Mavenfile",
      "Puppetfile",
      "Rakefile",
      "Snapfile",
      "Vagrantfile",
    ],
    mapping: ruby,
  },
  rust: {
    name: "Rust",
    extensions: [".rs", ".rs.in"],
    mapping: rust,
  },
  scala: {
    name: "Scala",
    extensions: [".scala", ".kojo", ".sbt", ".sc"],
    mapping: scala,
  },
  scss: {
    name: "Scss",
    extensions: [".scss"],
    mapping: scss,
  },
  shell: {
    aliases: ["sh", "bash", "shell-script", "zsh"],
    name: "Bash",
    extensions: [".sh", ".bash", ".zsh"],
    mapping: bash,
  },
  sql: {
    name: "SQL",
    extensions: [".sql", ".cql", ".ddl", ".mysql"],
    mapping: sql,
  },
  swift: {
    name: "Swift",
    extensions: [".swift"],
    mapping: swift,
  },
  text: {
    name: "Plain Text",
    extensions: [".txt"],
    mapping: plaintext,
  },
  tsx: {
    name: "React TSX",
    extensions: [".tsx"],
    mapping: typescript,
  },
  typescript: {
    aliases: ["ts"],
    name: "TypeScript",
    extensions: [".ts"],
    mapping: typescript,
  },
  vue: {
    name: "Vue",
    highlight: "html",
    extensions: [".vue"],
    mapping: xml,
  },
  xml: {
    aliases: ["rss", "xsd", "wsdl"],
    name: "XML",
    extensions: [".xml", ".ant"],
    filenames: [
      ".classpath",
      ".cproject",
      ".project",
      "App.config",
      "NuGet.config",
      "Settings.StyleCop",
      "Web.Debug.config",
      "Web.Release.config",
      "Web.config",
      "packages.config",
    ],
    mapping: xml,
  },
  yaml: {
    aliases: ["yml"],
    name: "YAML",
    extensions: [".yml", ".yaml"],
    filenames: [
      ".clang-format",
      ".clang-tidy",
      ".gemrc",
      "glide.lock",
      "yarn.lock",
    ],
    mapping: yaml,
  },
};
