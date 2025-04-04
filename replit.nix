{pkgs}: {
  deps = [
    pkgs.postgresql
    pkgs.ffmpeg
    pkgs.lsof
    pkgs.jq
  ];
}
