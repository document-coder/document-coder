import _ from "lodash";

function randomColor(country, s, l) {
  const s_n = Math.max(Math.min(s, 100 - s), 20) * 2;
  const num = (_.multiply(..._.map(country).map((c) => 4 + c.charCodeAt(0))) * 16807) % 2147483647;
  return `hsl(${num % 360}deg, ${(num % s_n) - s_n / 2 + s}%, ${l}%)`;
}

const stringifySentences = (sentences) => {
  const to_ret = [];
  for (var doc in sentences) {
    for (var p in sentences[doc]) {
      if (sentences[doc][p].length > 0)
        to_ret.push({
          pretty_string: `¶ ${doc}.${parseInt(p) + 1}(${_.map(
            sentences[doc][p],
            (e) => parseInt(e) + 1
          ).join(",")})`,
          policy_type: doc,
          paragraph_idx: p,
        });
    }
  }
  return to_ret;
};

const scrollToSentenceTarget = (e) => {
  document
    .getElementById(e.target.getAttribute("target"))
    .scrollIntoView({ behavior: "smooth", block: "center" });
};

const sentenceCount = (sentences_by_doc) => {
  return _.sum(_.values(sentences_by_doc).map((e) => _.sum(_.values(e).map((ee) => ee.length))));
};

export { randomColor, stringifySentences, scrollToSentenceTarget, sentenceCount };
