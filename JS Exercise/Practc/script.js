function starPattern() {
  for (var i = 0; i < 5; i++) {
    for (var j = 5; j > i; j--) {
      document.write("*");
    }
    document.write("<br>");
  }
}

starPattern();

var detail = {
  name: "Pasang Dorje Lama",
  dob: "14th November, 1996",
  edu: [
    {
      name: "Saraswati Higher Sec. School",
      date: "2010"
    },
    {
      name: "Goldengate Int'l College",
      date: "2012"
    },
    {
      name: "Trinity Int'l College",
      date: "2015"
    }
  ]
};
document.write("<br>Name: ");
document.write(detail.name);
document.write("<br>DOB: ");
document.write(detail.dob);
document.write("<br>");
document.write(detail.edu[0].name);
document.write("<br>Year: ");
document.write(detail.edu[0].date);
document.write("<br>");
document.write(detail.edu[1].name);
document.write("<br>Year: ");
document.write(detail.edu[1].date);
document.write("<br>");
document.write(detail.edu[2].name);
document.write("<br>Year: ");
document.write(detail.edu[2].date);
