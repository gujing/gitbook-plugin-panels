var marked = require('marked');

function parseMarkdown(text, debug) {
  const latexMatcher = /(\$\$[\s\S][^$]+\$\$)/g;
  const latexPlaceholder = 'LATEXPLACEHOLDER';
  const matches = text.match(latexMatcher);
  const textWithoutLatex = text.replace(latexMatcher, latexPlaceholder);

  var str = marked(textWithoutLatex);

  if (matches !== null) {
    for (var i = 0; i < matches.length; i++) {
      str = str.replace(latexPlaceholder, '$$' + matches[i] + '$$');
    }
  }

  return str;
};

/* `icon` is the name of a Font Awesome icon class. */
function panel(block, type, icon) {
  var s  = '<div class="panel panel-' + type + '">';
  if (block.args.length > 0) {
    s += '<div class="panel-heading">';
    s += '<h3 class="panel-title">';
    if (icon !== undefined) {
      s += '<i class="fa fa-' + icon + '">';
      s += "</i> ";
    }
    s += block.args[0];
    s += "</h3>";
    s += "</div>";
  }
  s += '<div class="panel-body">';
  s += parseMarkdown(block.body);
  s += "</div>";
  s += "</div>";
  return s;
}

module.exports = {
  website: {
    assets: "./assets",
    css: [
      "panels.css"
    ]
  },

  blocks: {
    // Block names that match Bootstrap classes
    panel: {
      process: function(block) {
        return panel(block, 'default');
      }
    },
    panel_primary: {
      process: function(block) {
        return panel(block, "primary");
      }
    },
    panel_success: {
      process: function(block) {
        return panel(block, "success");
      }
    },
    panel_warning: {
      process: function(block) {
        return panel(block, "warning");
      }
    },
    panel_danger: {
      process: function(block) {
        return panel(block, "danger");
      }
    },
    // Block names that match what we used in the SWC templates
    prereq: {
      process: function(block) {
        return panel(block, "warning", "rocket");
      }
    },
    callout: {
      process: function(block) {
        return panel(block, "primary", "info-circle");
      }
    },
    challenge: {
      process: function(block) {
        parseMarkdown(block.body, true);
        return panel(block, "success", "check-square-o");
      }
    },
    objectives: {
      process: function(block) {
        return panel(block, "warning", "line-chart");
      }
    }
  }
};
