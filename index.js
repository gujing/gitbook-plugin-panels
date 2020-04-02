var marked = require('marked');

function parseMarkdown(text, inline=false) {
  const latexMatcher = /(\$\$[\s\S][^$]+\$\$)/g;
  const latexPlaceholder = 'LATEXPLACEHOLDER';
  const matches = text.match(latexMatcher);
  const textWithoutLatex = text.replace(latexMatcher, latexPlaceholder);

  if (inline) {
      var str = marked.inlineLexer(textWithoutLatex, []);
  } else {
      var str = marked(textWithoutLatex);
  }

  if (matches !== null) {
    for (var i = 0; i < matches.length; i++) {
      str = str.replace(latexPlaceholder, '$$' + matches[i] + '$$');
    }
  }

  return str;
};

/* `icon` is the name of a Font Awesome icon class. */
function panel(output_type, block, style, icon, hide=false) {

  // Read keyword arguments, taking defaults from blocks
  style = block.kwargs.style || style;
  icon = block.kwargs.icon || icon;
  hide = "hide" in block.kwargs ? block.kwargs.hide : hide;

  // Generate a random id so blocks can be collapsed
  const id = Math.floor(Math.random()*10000000000);
  const start_closed = hide && output_type == 'website' && block.args.length > 0;

  var s  = '<div class="panel panel-' + style + '">';
  if (block.args.length > 0) {
    s += '<div class="panel-heading">';
    s += '<h3 class="panel-title" onclick="javascript:toggle('+id+');">';
    if (icon !== undefined) {
      s += '<i class="fa fa-' + icon + '">';
      s += "</i> ";
    }
    s += parseMarkdown(block.args[0], true);
    s +=  '<span id="heading-'+id+'">'
    if (start_closed) {
      s += '展开'
    }
    s += '</span>';
    s += "</h3>";
    s += "</div>";
  }
  if (start_closed) {
    s += '<div class="panel-body" style="display: none" id="panel-'+id+'">';
  } else {
    s += '<div class="panel-body" id="panel-'+id+'">';
  }
  s += parseMarkdown(block.body);
  if (block.blocks) {
    block.blocks.forEach((subblock) => {
      s += panel(output_type, subblock, "danger", "line-chart", true);
    });
  }
  s += "</div>";
  s += "</div>";
  return s;
}

module.exports = {
  website: {
    assets: "./assets",
    css: [
      "panels.css",
    ],
    js: [
      "panels.js",
    ]
  },
  ebook: {
    assets: "./assets",
    css: [
      "ebook.css",
    ]
  },

  blocks: {
    // Block names that match Bootstrap classes
    panel: {
      process: function(block) {
        // Valid styles:
        // default, primary, success, info, warning, danger
        return panel(this.output.name, block, "default");
      }
    },
    // Block names that match what we used in the SWC templates
    prereq: {
      process: function(block) {
        return panel(this.output.name, block, "warning", "rocket");
      }
    },
    callout: {
      process: function(block) {
        return panel(this.output.name, block, "primary", "info-circle");
      }
    },
    challenge: {
      blocks: ['solution'],
      process: function(block) {
        return panel(this.output.name, block, "success", "square-o");
      }
    },
    hiddenchallenge: {
      blocks: ['solution'],
      process: function(block) {
        return panel(this.output.name, block, "success", "square-o", true);
      }
    },
    solution: {
      process: function(block) {
        return panel(this.output.name, block, "danger", "check-square-o", true);
      }
    },
    objectives: {
      process: function(block) {
        return panel(this.output.name, block, "warning", "line-chart");
      }
    },
    keypoints: {
      process: function(block) {
        return panel(this.output.name, block, "success", "key");
      }
    },
    discussion: {
      process: function(block) {
        return panel(this.output.name, block, "info", "bell", true);
      }
    }
  }
};
