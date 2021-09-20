import { c as createCommonjsModule, a as commonjsGlobal } from './common/_commonjsHelpers-8c19dec8.js';

var loadImage = createCommonjsModule(function (module) {
(function ($) {

  var urlAPI = $.URL || $.webkitURL;

  /**
   * Creates an object URL for a given File object.
   *
   * @param {Blob} blob Blob object
   * @returns {string|boolean} Returns object URL if API exists, else false.
   */
  function createObjectURL(blob) {
    return urlAPI ? urlAPI.createObjectURL(blob) : false
  }

  /**
   * Revokes a given object URL.
   *
   * @param {string} url Blob object URL
   * @returns {undefined|boolean} Returns undefined if API exists, else false.
   */
  function revokeObjectURL(url) {
    return urlAPI ? urlAPI.revokeObjectURL(url) : false
  }

  /**
   * Helper function to revoke an object URL
   *
   * @param {string} url Blob Object URL
   * @param {object} [options] Options object
   */
  function revokeHelper(url, options) {
    if (url && url.slice(0, 5) === 'blob:' && !(options && options.noRevoke)) {
      revokeObjectURL(url);
    }
  }

  /**
   * Loads a given File object via FileReader interface.
   *
   * @param {Blob} file Blob object
   * @param {Function} onload Load event callback
   * @param {Function} [onerror] Error/Abort event callback
   * @param {string} [method=readAsDataURL] FileReader method
   * @returns {FileReader|boolean} Returns FileReader if API exists, else false.
   */
  function readFile(file, onload, onerror, method) {
    if (!$.FileReader) return false
    var reader = new FileReader();
    reader.onload = function () {
      onload.call(reader, this.result);
    };
    if (onerror) {
      reader.onabort = reader.onerror = function () {
        onerror.call(reader, this.error);
      };
    }
    var readerMethod = reader[method || 'readAsDataURL'];
    if (readerMethod) {
      readerMethod.call(reader, file);
      return reader
    }
  }

  /**
   * Cross-frame instanceof check.
   *
   * @param {string} type Instance type
   * @param {object} obj Object instance
   * @returns {boolean} Returns true if the object is of the given instance.
   */
  function isInstanceOf(type, obj) {
    // Cross-frame instanceof check
    return Object.prototype.toString.call(obj) === '[object ' + type + ']'
  }

  /**
   * @typedef { HTMLImageElement|HTMLCanvasElement } Result
   */

  /**
   * Loads an image for a given File object.
   *
   * @param {Blob|string} file Blob object or image URL
   * @param {Function|object} [callback] Image load event callback or options
   * @param {object} [options] Options object
   * @returns {HTMLImageElement|FileReader|Promise<Result>} Object
   */
  function loadImage(file, callback, options) {
    /**
     * Promise executor
     *
     * @param {Function} resolve Resolution function
     * @param {Function} reject Rejection function
     * @returns {HTMLImageElement|FileReader} Object
     */
    function executor(resolve, reject) {
      var img = document.createElement('img');
      var url;
      /**
       * Callback for the fetchBlob call.
       *
       * @param {HTMLImageElement|HTMLCanvasElement} img Error object
       * @param {object} data Data object
       * @returns {undefined} Undefined
       */
      function resolveWrapper(img, data) {
        if (resolve === reject) {
          // Not using Promises
          if (resolve) resolve(img, data);
          return
        } else if (img instanceof Error) {
          reject(img);
          return
        }
        data = data || {}; // eslint-disable-line no-param-reassign
        data.image = img;
        resolve(data);
      }
      /**
       * Callback for the fetchBlob call.
       *
       * @param {Blob} blob Blob object
       * @param {Error} err Error object
       */
      function fetchBlobCallback(blob, err) {
        if (err && $.console) console.log(err); // eslint-disable-line no-console
        if (blob && isInstanceOf('Blob', blob)) {
          file = blob; // eslint-disable-line no-param-reassign
          url = createObjectURL(file);
        } else {
          url = file;
          if (options && options.crossOrigin) {
            img.crossOrigin = options.crossOrigin;
          }
        }
        img.src = url;
      }
      img.onerror = function (event) {
        revokeHelper(url, options);
        if (reject) reject.call(img, event);
      };
      img.onload = function () {
        revokeHelper(url, options);
        var data = {
          originalWidth: img.naturalWidth || img.width,
          originalHeight: img.naturalHeight || img.height
        };
        try {
          loadImage.transform(img, options, resolveWrapper, file, data);
        } catch (error) {
          if (reject) reject(error);
        }
      };
      if (typeof file === 'string') {
        if (loadImage.requiresMetaData(options)) {
          loadImage.fetchBlob(file, fetchBlobCallback, options);
        } else {
          fetchBlobCallback();
        }
        return img
      } else if (isInstanceOf('Blob', file) || isInstanceOf('File', file)) {
        url = createObjectURL(file);
        if (url) {
          img.src = url;
          return img
        }
        return readFile(
          file,
          function (url) {
            img.src = url;
          },
          reject
        )
      }
    }
    if ($.Promise && typeof callback !== 'function') {
      options = callback; // eslint-disable-line no-param-reassign
      return new Promise(executor)
    }
    return executor(callback, callback)
  }

  // Determines if metadata should be loaded automatically.
  // Requires the load image meta extension to load metadata.
  loadImage.requiresMetaData = function (options) {
    return options && options.meta
  };

  // If the callback given to this function returns a blob, it is used as image
  // source instead of the original url and overrides the file argument used in
  // the onload and onerror event callbacks:
  loadImage.fetchBlob = function (url, callback) {
    callback();
  };

  loadImage.transform = function (img, options, callback, file, data) {
    callback(img, data);
  };

  loadImage.global = $;
  loadImage.readFile = readFile;
  loadImage.isInstanceOf = isInstanceOf;
  loadImage.createObjectURL = createObjectURL;
  loadImage.revokeObjectURL = revokeObjectURL;

  if ( module.exports) {
    module.exports = loadImage;
  } else {
    $.loadImage = loadImage;
  }
})((typeof window !== 'undefined' && window) || commonjsGlobal);
});

var loadImageScale = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(loadImage);
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  var originalTransform = loadImage.transform;

  loadImage.createCanvas = function (width, height, offscreen) {
    if (offscreen && loadImage.global.OffscreenCanvas) {
      return new OffscreenCanvas(width, height)
    }
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas
  };

  loadImage.transform = function (img, options, callback, file, data) {
    originalTransform.call(
      loadImage,
      loadImage.scale(img, options, data),
      options,
      callback,
      file,
      data
    );
  };

  // Transform image coordinates, allows to override e.g.
  // the canvas orientation based on the orientation option,
  // gets canvas, options and data passed as arguments:
  loadImage.transformCoordinates = function () {};

  // Returns transformed options, allows to override e.g.
  // maxWidth, maxHeight and crop options based on the aspectRatio.
  // gets img, options, data passed as arguments:
  loadImage.getTransformedOptions = function (img, options) {
    var aspectRatio = options.aspectRatio;
    var newOptions;
    var i;
    var width;
    var height;
    if (!aspectRatio) {
      return options
    }
    newOptions = {};
    for (i in options) {
      if (Object.prototype.hasOwnProperty.call(options, i)) {
        newOptions[i] = options[i];
      }
    }
    newOptions.crop = true;
    width = img.naturalWidth || img.width;
    height = img.naturalHeight || img.height;
    if (width / height > aspectRatio) {
      newOptions.maxWidth = height * aspectRatio;
      newOptions.maxHeight = height;
    } else {
      newOptions.maxWidth = width;
      newOptions.maxHeight = width / aspectRatio;
    }
    return newOptions
  };

  // Canvas render method, allows to implement a different rendering algorithm:
  loadImage.drawImage = function (
    img,
    canvas,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destWidth,
    destHeight,
    options
  ) {
    var ctx = canvas.getContext('2d');
    if (options.imageSmoothingEnabled === false) {
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    } else if (options.imageSmoothingQuality) {
      ctx.imageSmoothingQuality = options.imageSmoothingQuality;
    }
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      destWidth,
      destHeight
    );
    return ctx
  };

  // Determines if the target image should be a canvas element:
  loadImage.requiresCanvas = function (options) {
    return options.canvas || options.crop || !!options.aspectRatio
  };

  // Scales and/or crops the given image (img or canvas HTML element)
  // using the given options:
  loadImage.scale = function (img, options, data) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    // eslint-disable-next-line no-param-reassign
    data = data || {};
    var useCanvas =
      img.getContext ||
      (loadImage.requiresCanvas(options) &&
        !!loadImage.global.HTMLCanvasElement);
    var width = img.naturalWidth || img.width;
    var height = img.naturalHeight || img.height;
    var destWidth = width;
    var destHeight = height;
    var maxWidth;
    var maxHeight;
    var minWidth;
    var minHeight;
    var sourceWidth;
    var sourceHeight;
    var sourceX;
    var sourceY;
    var pixelRatio;
    var downsamplingRatio;
    var tmp;
    var canvas;
    /**
     * Scales up image dimensions
     */
    function scaleUp() {
      var scale = Math.max(
        (minWidth || destWidth) / destWidth,
        (minHeight || destHeight) / destHeight
      );
      if (scale > 1) {
        destWidth *= scale;
        destHeight *= scale;
      }
    }
    /**
     * Scales down image dimensions
     */
    function scaleDown() {
      var scale = Math.min(
        (maxWidth || destWidth) / destWidth,
        (maxHeight || destHeight) / destHeight
      );
      if (scale < 1) {
        destWidth *= scale;
        destHeight *= scale;
      }
    }
    if (useCanvas) {
      // eslint-disable-next-line no-param-reassign
      options = loadImage.getTransformedOptions(img, options, data);
      sourceX = options.left || 0;
      sourceY = options.top || 0;
      if (options.sourceWidth) {
        sourceWidth = options.sourceWidth;
        if (options.right !== undefined && options.left === undefined) {
          sourceX = width - sourceWidth - options.right;
        }
      } else {
        sourceWidth = width - sourceX - (options.right || 0);
      }
      if (options.sourceHeight) {
        sourceHeight = options.sourceHeight;
        if (options.bottom !== undefined && options.top === undefined) {
          sourceY = height - sourceHeight - options.bottom;
        }
      } else {
        sourceHeight = height - sourceY - (options.bottom || 0);
      }
      destWidth = sourceWidth;
      destHeight = sourceHeight;
    }
    maxWidth = options.maxWidth;
    maxHeight = options.maxHeight;
    minWidth = options.minWidth;
    minHeight = options.minHeight;
    if (useCanvas && maxWidth && maxHeight && options.crop) {
      destWidth = maxWidth;
      destHeight = maxHeight;
      tmp = sourceWidth / sourceHeight - maxWidth / maxHeight;
      if (tmp < 0) {
        sourceHeight = (maxHeight * sourceWidth) / maxWidth;
        if (options.top === undefined && options.bottom === undefined) {
          sourceY = (height - sourceHeight) / 2;
        }
      } else if (tmp > 0) {
        sourceWidth = (maxWidth * sourceHeight) / maxHeight;
        if (options.left === undefined && options.right === undefined) {
          sourceX = (width - sourceWidth) / 2;
        }
      }
    } else {
      if (options.contain || options.cover) {
        minWidth = maxWidth = maxWidth || minWidth;
        minHeight = maxHeight = maxHeight || minHeight;
      }
      if (options.cover) {
        scaleDown();
        scaleUp();
      } else {
        scaleUp();
        scaleDown();
      }
    }
    if (useCanvas) {
      pixelRatio = options.pixelRatio;
      if (
        pixelRatio > 1 &&
        // Check if the image has not yet had the device pixel ratio applied:
        !(
          img.style.width &&
          Math.floor(parseFloat(img.style.width, 10)) ===
            Math.floor(width / pixelRatio)
        )
      ) {
        destWidth *= pixelRatio;
        destHeight *= pixelRatio;
      }
      // Check if workaround for Chromium orientation crop bug is required:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1074354
      if (
        loadImage.orientationCropBug &&
        !img.getContext &&
        (sourceX || sourceY || sourceWidth !== width || sourceHeight !== height)
      ) {
        // Write the complete source image to an intermediate canvas first:
        tmp = img;
        // eslint-disable-next-line no-param-reassign
        img = loadImage.createCanvas(width, height, true);
        loadImage.drawImage(
          tmp,
          img,
          0,
          0,
          width,
          height,
          width,
          height,
          options
        );
      }
      downsamplingRatio = options.downsamplingRatio;
      if (
        downsamplingRatio > 0 &&
        downsamplingRatio < 1 &&
        destWidth < sourceWidth &&
        destHeight < sourceHeight
      ) {
        while (sourceWidth * downsamplingRatio > destWidth) {
          canvas = loadImage.createCanvas(
            sourceWidth * downsamplingRatio,
            sourceHeight * downsamplingRatio,
            true
          );
          loadImage.drawImage(
            img,
            canvas,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            canvas.width,
            canvas.height,
            options
          );
          sourceX = 0;
          sourceY = 0;
          sourceWidth = canvas.width;
          sourceHeight = canvas.height;
          // eslint-disable-next-line no-param-reassign
          img = canvas;
        }
      }
      canvas = loadImage.createCanvas(destWidth, destHeight);
      loadImage.transformCoordinates(canvas, options, data);
      if (pixelRatio > 1) {
        canvas.style.width = canvas.width / pixelRatio + 'px';
      }
      loadImage
        .drawImage(
          img,
          canvas,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          destWidth,
          destHeight,
          options
        )
        .setTransform(1, 0, 0, 1, 0, 0); // reset to the identity matrix
      return canvas
    }
    img.width = destWidth;
    img.height = destHeight;
    return img
  };
});
});

var loadImageMeta = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(loadImage);
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  var global = loadImage.global;
  var originalTransform = loadImage.transform;

  var blobSlice =
    global.Blob &&
    (Blob.prototype.slice ||
      Blob.prototype.webkitSlice ||
      Blob.prototype.mozSlice);

  var bufferSlice =
    (global.ArrayBuffer && ArrayBuffer.prototype.slice) ||
    function (begin, end) {
      // Polyfill for IE10, which does not support ArrayBuffer.slice
      // eslint-disable-next-line no-param-reassign
      end = end || this.byteLength - begin;
      var arr1 = new Uint8Array(this, begin, end);
      var arr2 = new Uint8Array(end);
      arr2.set(arr1);
      return arr2.buffer
    };

  var metaDataParsers = {
    jpeg: {
      0xffe1: [], // APP1 marker
      0xffed: [] // APP13 marker
    }
  };

  /**
   * Parses image metadata and calls the callback with an object argument
   * with the following property:
   * - imageHead: The complete image head as ArrayBuffer
   * The options argument accepts an object and supports the following
   * properties:
   * - maxMetaDataSize: Defines the maximum number of bytes to parse.
   * - disableImageHead: Disables creating the imageHead property.
   *
   * @param {Blob} file Blob object
   * @param {Function} [callback] Callback function
   * @param {object} [options] Parsing options
   * @param {object} [data] Result data object
   * @returns {Promise<object>|undefined} Returns Promise if no callback given.
   */
  function parseMetaData(file, callback, options, data) {
    var that = this;
    /**
     * Promise executor
     *
     * @param {Function} resolve Resolution function
     * @param {Function} reject Rejection function
     * @returns {undefined} Undefined
     */
    function executor(resolve, reject) {
      if (
        !(
          global.DataView &&
          blobSlice &&
          file &&
          file.size >= 12 &&
          file.type === 'image/jpeg'
        )
      ) {
        // Nothing to parse
        return resolve(data)
      }
      // 256 KiB should contain all EXIF/ICC/IPTC segments:
      var maxMetaDataSize = options.maxMetaDataSize || 262144;
      if (
        !loadImage.readFile(
          blobSlice.call(file, 0, maxMetaDataSize),
          function (buffer) {
            // Note on endianness:
            // Since the marker and length bytes in JPEG files are always
            // stored in big endian order, we can leave the endian parameter
            // of the DataView methods undefined, defaulting to big endian.
            var dataView = new DataView(buffer);
            // Check for the JPEG marker (0xffd8):
            if (dataView.getUint16(0) !== 0xffd8) {
              return reject(
                new Error('Invalid JPEG file: Missing JPEG marker.')
              )
            }
            var offset = 2;
            var maxOffset = dataView.byteLength - 4;
            var headLength = offset;
            var markerBytes;
            var markerLength;
            var parsers;
            var i;
            while (offset < maxOffset) {
              markerBytes = dataView.getUint16(offset);
              // Search for APPn (0xffeN) and COM (0xfffe) markers,
              // which contain application-specific metadata like
              // Exif, ICC and IPTC data and text comments:
              if (
                (markerBytes >= 0xffe0 && markerBytes <= 0xffef) ||
                markerBytes === 0xfffe
              ) {
                // The marker bytes (2) are always followed by
                // the length bytes (2), indicating the length of the
                // marker segment, which includes the length bytes,
                // but not the marker bytes, so we add 2:
                markerLength = dataView.getUint16(offset + 2) + 2;
                if (offset + markerLength > dataView.byteLength) {
                  // eslint-disable-next-line no-console
                  console.log('Invalid JPEG metadata: Invalid segment size.');
                  break
                }
                parsers = metaDataParsers.jpeg[markerBytes];
                if (parsers && !options.disableMetaDataParsers) {
                  for (i = 0; i < parsers.length; i += 1) {
                    parsers[i].call(
                      that,
                      dataView,
                      offset,
                      markerLength,
                      data,
                      options
                    );
                  }
                }
                offset += markerLength;
                headLength = offset;
              } else {
                // Not an APPn or COM marker, probably safe to
                // assume that this is the end of the metadata
                break
              }
            }
            // Meta length must be longer than JPEG marker (2)
            // plus APPn marker (2), followed by length bytes (2):
            if (!options.disableImageHead && headLength > 6) {
              data.imageHead = bufferSlice.call(buffer, 0, headLength);
            }
            resolve(data);
          },
          reject,
          'readAsArrayBuffer'
        )
      ) {
        // No support for the FileReader interface, nothing to parse
        resolve(data);
      }
    }
    options = options || {}; // eslint-disable-line no-param-reassign
    if (global.Promise && typeof callback !== 'function') {
      options = callback || {}; // eslint-disable-line no-param-reassign
      data = options; // eslint-disable-line no-param-reassign
      return new Promise(executor)
    }
    data = data || {}; // eslint-disable-line no-param-reassign
    return executor(callback, callback)
  }

  /**
   * Replaces the head of a JPEG Blob
   *
   * @param {Blob} blob Blob object
   * @param {ArrayBuffer} oldHead Old JPEG head
   * @param {ArrayBuffer} newHead New JPEG head
   * @returns {Blob} Combined Blob
   */
  function replaceJPEGHead(blob, oldHead, newHead) {
    if (!blob || !oldHead || !newHead) return null
    return new Blob([newHead, blobSlice.call(blob, oldHead.byteLength)], {
      type: 'image/jpeg'
    })
  }

  /**
   * Replaces the image head of a JPEG blob with the given one.
   * Returns a Promise or calls the callback with the new Blob.
   *
   * @param {Blob} blob Blob object
   * @param {ArrayBuffer} head New JPEG head
   * @param {Function} [callback] Callback function
   * @returns {Promise<Blob|null>|undefined} Combined Blob
   */
  function replaceHead(blob, head, callback) {
    var options = { maxMetaDataSize: 256, disableMetaDataParsers: true };
    if (!callback && global.Promise) {
      return parseMetaData(blob, options).then(function (data) {
        return replaceJPEGHead(blob, data.imageHead, head)
      })
    }
    parseMetaData(
      blob,
      function (data) {
        callback(replaceJPEGHead(blob, data.imageHead, head));
      },
      options
    );
  }

  loadImage.transform = function (img, options, callback, file, data) {
    if (loadImage.requiresMetaData(options)) {
      data = data || {}; // eslint-disable-line no-param-reassign
      parseMetaData(
        file,
        function (result) {
          if (result !== data) {
            // eslint-disable-next-line no-console
            if (global.console) console.log(result);
            result = data; // eslint-disable-line no-param-reassign
          }
          originalTransform.call(
            loadImage,
            img,
            options,
            callback,
            file,
            result
          );
        },
        options,
        data
      );
    } else {
      originalTransform.apply(loadImage, arguments);
    }
  };

  loadImage.blobSlice = blobSlice;
  loadImage.bufferSlice = bufferSlice;
  loadImage.replaceHead = replaceHead;
  loadImage.parseMetaData = parseMetaData;
  loadImage.metaDataParsers = metaDataParsers;
});
});

var loadImageFetch = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(loadImage);
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  var global = loadImage.global;

  if (
    global.fetch &&
    global.Request &&
    global.Response &&
    global.Response.prototype.blob
  ) {
    loadImage.fetchBlob = function (url, callback, options) {
      /**
       * Fetch response handler.
       *
       * @param {Response} response Fetch response
       * @returns {Blob} Fetched Blob.
       */
      function responseHandler(response) {
        return response.blob()
      }
      if (global.Promise && typeof callback !== 'function') {
        return fetch(new Request(url, callback)).then(responseHandler)
      }
      fetch(new Request(url, options))
        .then(responseHandler)
        .then(callback)
        [
          // Avoid parsing error in IE<9, where catch is a reserved word.
          // eslint-disable-next-line dot-notation
          'catch'
        ](function (err) {
          callback(null, err);
        });
    };
  } else if (
    global.XMLHttpRequest &&
    // https://xhr.spec.whatwg.org/#the-responsetype-attribute
    new XMLHttpRequest().responseType === ''
  ) {
    loadImage.fetchBlob = function (url, callback, options) {
      /**
       * Promise executor
       *
       * @param {Function} resolve Resolution function
       * @param {Function} reject Rejection function
       */
      function executor(resolve, reject) {
        options = options || {}; // eslint-disable-line no-param-reassign
        var req = new XMLHttpRequest();
        req.open(options.method || 'GET', url);
        if (options.headers) {
          Object.keys(options.headers).forEach(function (key) {
            req.setRequestHeader(key, options.headers[key]);
          });
        }
        req.withCredentials = options.credentials === 'include';
        req.responseType = 'blob';
        req.onload = function () {
          resolve(req.response);
        };
        req.onerror = req.onabort = req.ontimeout = function (err) {
          if (resolve === reject) {
            // Not using Promises
            reject(null, err);
          } else {
            reject(err);
          }
        };
        req.send(options.body);
      }
      if (global.Promise && typeof callback !== 'function') {
        options = callback; // eslint-disable-line no-param-reassign
        return new Promise(executor)
      }
      return executor(callback, callback)
    };
  }
});
});

var loadImageExif = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(loadImage, loadImageMeta);
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  /**
   * Exif tag map
   *
   * @name ExifMap
   * @class
   * @param {number|string} tagCode IFD tag code
   */
  function ExifMap(tagCode) {
    if (tagCode) {
      Object.defineProperty(this, 'map', {
        value: this.ifds[tagCode].map
      });
      Object.defineProperty(this, 'tags', {
        value: (this.tags && this.tags[tagCode]) || {}
      });
    }
  }

  ExifMap.prototype.map = {
    Orientation: 0x0112,
    Thumbnail: 'ifd1',
    Blob: 0x0201, // Alias for JPEGInterchangeFormat
    Exif: 0x8769,
    GPSInfo: 0x8825,
    Interoperability: 0xa005
  };

  ExifMap.prototype.ifds = {
    ifd1: { name: 'Thumbnail', map: ExifMap.prototype.map },
    0x8769: { name: 'Exif', map: {} },
    0x8825: { name: 'GPSInfo', map: {} },
    0xa005: { name: 'Interoperability', map: {} }
  };

  /**
   * Retrieves exif tag value
   *
   * @param {number|string} id Exif tag code or name
   * @returns {object} Exif tag value
   */
  ExifMap.prototype.get = function (id) {
    return this[id] || this[this.map[id]]
  };

  /**
   * Returns the Exif Thumbnail data as Blob.
   *
   * @param {DataView} dataView Data view interface
   * @param {number} offset Thumbnail data offset
   * @param {number} length Thumbnail data length
   * @returns {undefined|Blob} Returns the Thumbnail Blob or undefined
   */
  function getExifThumbnail(dataView, offset, length) {
    if (!length) return
    if (offset + length > dataView.byteLength) {
      console.log('Invalid Exif data: Invalid thumbnail data.');
      return
    }
    return new Blob(
      [loadImage.bufferSlice.call(dataView.buffer, offset, offset + length)],
      {
        type: 'image/jpeg'
      }
    )
  }

  var ExifTagTypes = {
    // byte, 8-bit unsigned int:
    1: {
      getValue: function (dataView, dataOffset) {
        return dataView.getUint8(dataOffset)
      },
      size: 1
    },
    // ascii, 8-bit byte:
    2: {
      getValue: function (dataView, dataOffset) {
        return String.fromCharCode(dataView.getUint8(dataOffset))
      },
      size: 1,
      ascii: true
    },
    // short, 16 bit int:
    3: {
      getValue: function (dataView, dataOffset, littleEndian) {
        return dataView.getUint16(dataOffset, littleEndian)
      },
      size: 2
    },
    // long, 32 bit int:
    4: {
      getValue: function (dataView, dataOffset, littleEndian) {
        return dataView.getUint32(dataOffset, littleEndian)
      },
      size: 4
    },
    // rational = two long values, first is numerator, second is denominator:
    5: {
      getValue: function (dataView, dataOffset, littleEndian) {
        return (
          dataView.getUint32(dataOffset, littleEndian) /
          dataView.getUint32(dataOffset + 4, littleEndian)
        )
      },
      size: 8
    },
    // slong, 32 bit signed int:
    9: {
      getValue: function (dataView, dataOffset, littleEndian) {
        return dataView.getInt32(dataOffset, littleEndian)
      },
      size: 4
    },
    // srational, two slongs, first is numerator, second is denominator:
    10: {
      getValue: function (dataView, dataOffset, littleEndian) {
        return (
          dataView.getInt32(dataOffset, littleEndian) /
          dataView.getInt32(dataOffset + 4, littleEndian)
        )
      },
      size: 8
    }
  };
  // undefined, 8-bit byte, value depending on field:
  ExifTagTypes[7] = ExifTagTypes[1];

  /**
   * Returns Exif tag value.
   *
   * @param {DataView} dataView Data view interface
   * @param {number} tiffOffset TIFF offset
   * @param {number} offset Tag offset
   * @param {number} type Tag type
   * @param {number} length Tag length
   * @param {boolean} littleEndian Little endian encoding
   * @returns {object} Tag value
   */
  function getExifValue(
    dataView,
    tiffOffset,
    offset,
    type,
    length,
    littleEndian
  ) {
    var tagType = ExifTagTypes[type];
    var tagSize;
    var dataOffset;
    var values;
    var i;
    var str;
    var c;
    if (!tagType) {
      console.log('Invalid Exif data: Invalid tag type.');
      return
    }
    tagSize = tagType.size * length;
    // Determine if the value is contained in the dataOffset bytes,
    // or if the value at the dataOffset is a pointer to the actual data:
    dataOffset =
      tagSize > 4
        ? tiffOffset + dataView.getUint32(offset + 8, littleEndian)
        : offset + 8;
    if (dataOffset + tagSize > dataView.byteLength) {
      console.log('Invalid Exif data: Invalid data offset.');
      return
    }
    if (length === 1) {
      return tagType.getValue(dataView, dataOffset, littleEndian)
    }
    values = [];
    for (i = 0; i < length; i += 1) {
      values[i] = tagType.getValue(
        dataView,
        dataOffset + i * tagType.size,
        littleEndian
      );
    }
    if (tagType.ascii) {
      str = '';
      // Concatenate the chars:
      for (i = 0; i < values.length; i += 1) {
        c = values[i];
        // Ignore the terminating NULL byte(s):
        if (c === '\u0000') {
          break
        }
        str += c;
      }
      return str
    }
    return values
  }

  /**
   * Determines if the given tag should be included.
   *
   * @param {object} includeTags Map of tags to include
   * @param {object} excludeTags Map of tags to exclude
   * @param {number|string} tagCode Tag code to check
   * @returns {boolean} True if the tag should be included
   */
  function shouldIncludeTag(includeTags, excludeTags, tagCode) {
    return (
      (!includeTags || includeTags[tagCode]) &&
      (!excludeTags || excludeTags[tagCode] !== true)
    )
  }

  /**
   * Parses Exif tags.
   *
   * @param {DataView} dataView Data view interface
   * @param {number} tiffOffset TIFF offset
   * @param {number} dirOffset Directory offset
   * @param {boolean} littleEndian Little endian encoding
   * @param {ExifMap} tags Map to store parsed exif tags
   * @param {ExifMap} tagOffsets Map to store parsed exif tag offsets
   * @param {object} includeTags Map of tags to include
   * @param {object} excludeTags Map of tags to exclude
   * @returns {number} Next directory offset
   */
  function parseExifTags(
    dataView,
    tiffOffset,
    dirOffset,
    littleEndian,
    tags,
    tagOffsets,
    includeTags,
    excludeTags
  ) {
    var tagsNumber, dirEndOffset, i, tagOffset, tagNumber, tagValue;
    if (dirOffset + 6 > dataView.byteLength) {
      console.log('Invalid Exif data: Invalid directory offset.');
      return
    }
    tagsNumber = dataView.getUint16(dirOffset, littleEndian);
    dirEndOffset = dirOffset + 2 + 12 * tagsNumber;
    if (dirEndOffset + 4 > dataView.byteLength) {
      console.log('Invalid Exif data: Invalid directory size.');
      return
    }
    for (i = 0; i < tagsNumber; i += 1) {
      tagOffset = dirOffset + 2 + 12 * i;
      tagNumber = dataView.getUint16(tagOffset, littleEndian);
      if (!shouldIncludeTag(includeTags, excludeTags, tagNumber)) continue
      tagValue = getExifValue(
        dataView,
        tiffOffset,
        tagOffset,
        dataView.getUint16(tagOffset + 2, littleEndian), // tag type
        dataView.getUint32(tagOffset + 4, littleEndian), // tag length
        littleEndian
      );
      tags[tagNumber] = tagValue;
      if (tagOffsets) {
        tagOffsets[tagNumber] = tagOffset;
      }
    }
    // Return the offset to the next directory:
    return dataView.getUint32(dirEndOffset, littleEndian)
  }

  /**
   * Parses tags in a given IFD (Image File Directory).
   *
   * @param {object} data Data object to store exif tags and offsets
   * @param {number|string} tagCode IFD tag code
   * @param {DataView} dataView Data view interface
   * @param {number} tiffOffset TIFF offset
   * @param {boolean} littleEndian Little endian encoding
   * @param {object} includeTags Map of tags to include
   * @param {object} excludeTags Map of tags to exclude
   */
  function parseExifIFD(
    data,
    tagCode,
    dataView,
    tiffOffset,
    littleEndian,
    includeTags,
    excludeTags
  ) {
    var dirOffset = data.exif[tagCode];
    if (dirOffset) {
      data.exif[tagCode] = new ExifMap(tagCode);
      if (data.exifOffsets) {
        data.exifOffsets[tagCode] = new ExifMap(tagCode);
      }
      parseExifTags(
        dataView,
        tiffOffset,
        tiffOffset + dirOffset,
        littleEndian,
        data.exif[tagCode],
        data.exifOffsets && data.exifOffsets[tagCode],
        includeTags && includeTags[tagCode],
        excludeTags && excludeTags[tagCode]
      );
    }
  }

  loadImage.parseExifData = function (dataView, offset, length, data, options) {
    if (options.disableExif) {
      return
    }
    var includeTags = options.includeExifTags;
    var excludeTags = options.excludeExifTags || {
      0x8769: {
        // ExifIFDPointer
        0x927c: true // MakerNote
      }
    };
    var tiffOffset = offset + 10;
    var littleEndian;
    var dirOffset;
    var thumbnailIFD;
    // Check for the ASCII code for "Exif" (0x45786966):
    if (dataView.getUint32(offset + 4) !== 0x45786966) {
      // No Exif data, might be XMP data instead
      return
    }
    if (tiffOffset + 8 > dataView.byteLength) {
      console.log('Invalid Exif data: Invalid segment size.');
      return
    }
    // Check for the two null bytes:
    if (dataView.getUint16(offset + 8) !== 0x0000) {
      console.log('Invalid Exif data: Missing byte alignment offset.');
      return
    }
    // Check the byte alignment:
    switch (dataView.getUint16(tiffOffset)) {
      case 0x4949:
        littleEndian = true;
        break
      case 0x4d4d:
        littleEndian = false;
        break
      default:
        console.log('Invalid Exif data: Invalid byte alignment marker.');
        return
    }
    // Check for the TIFF tag marker (0x002A):
    if (dataView.getUint16(tiffOffset + 2, littleEndian) !== 0x002a) {
      console.log('Invalid Exif data: Missing TIFF marker.');
      return
    }
    // Retrieve the directory offset bytes, usually 0x00000008 or 8 decimal:
    dirOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
    // Create the exif object to store the tags:
    data.exif = new ExifMap();
    if (!options.disableExifOffsets) {
      data.exifOffsets = new ExifMap();
      data.exifTiffOffset = tiffOffset;
      data.exifLittleEndian = littleEndian;
    }
    // Parse the tags of the main image directory (IFD0) and retrieve the
    // offset to the next directory (IFD1), usually the thumbnail directory:
    dirOffset = parseExifTags(
      dataView,
      tiffOffset,
      tiffOffset + dirOffset,
      littleEndian,
      data.exif,
      data.exifOffsets,
      includeTags,
      excludeTags
    );
    if (dirOffset && shouldIncludeTag(includeTags, excludeTags, 'ifd1')) {
      data.exif.ifd1 = dirOffset;
      if (data.exifOffsets) {
        data.exifOffsets.ifd1 = tiffOffset + dirOffset;
      }
    }
    Object.keys(data.exif.ifds).forEach(function (tagCode) {
      parseExifIFD(
        data,
        tagCode,
        dataView,
        tiffOffset,
        littleEndian,
        includeTags,
        excludeTags
      );
    });
    thumbnailIFD = data.exif.ifd1;
    // Check for JPEG Thumbnail offset and data length:
    if (thumbnailIFD && thumbnailIFD[0x0201]) {
      thumbnailIFD[0x0201] = getExifThumbnail(
        dataView,
        tiffOffset + thumbnailIFD[0x0201],
        thumbnailIFD[0x0202] // Thumbnail data length
      );
    }
  };

  // Registers the Exif parser for the APP1 JPEG metadata segment:
  loadImage.metaDataParsers.jpeg[0xffe1].push(loadImage.parseExifData);

  loadImage.exifWriters = {
    // Orientation writer:
    0x0112: function (buffer, data, value) {
      var orientationOffset = data.exifOffsets[0x0112];
      if (!orientationOffset) return buffer
      var view = new DataView(buffer, orientationOffset + 8, 2);
      view.setUint16(0, value, data.exifLittleEndian);
      return buffer
    }
  };

  loadImage.writeExifData = function (buffer, data, id, value) {
    return loadImage.exifWriters[data.exif.map[id]](buffer, data, value)
  };

  loadImage.ExifMap = ExifMap;

  // Adds the following properties to the parseMetaData callback data:
  // - exif: The parsed Exif tags
  // - exifOffsets: The parsed Exif tag offsets
  // - exifTiffOffset: TIFF header offset (used for offset pointers)
  // - exifLittleEndian: little endian order if true, big endian if false

  // Adds the following options to the parseMetaData method:
  // - disableExif: Disables Exif parsing when true.
  // - disableExifOffsets: Disables storing Exif tag offsets when true.
  // - includeExifTags: A map of Exif tags to include for parsing.
  // - excludeExifTags: A map of Exif tags to exclude from parsing.
});
});

var loadImageExifMap = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(loadImage, loadImageExif);
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  var ExifMapProto = loadImage.ExifMap.prototype;

  ExifMapProto.tags = {
    // =================
    // TIFF tags (IFD0):
    // =================
    0x0100: 'ImageWidth',
    0x0101: 'ImageHeight',
    0x0102: 'BitsPerSample',
    0x0103: 'Compression',
    0x0106: 'PhotometricInterpretation',
    0x0112: 'Orientation',
    0x0115: 'SamplesPerPixel',
    0x011c: 'PlanarConfiguration',
    0x0212: 'YCbCrSubSampling',
    0x0213: 'YCbCrPositioning',
    0x011a: 'XResolution',
    0x011b: 'YResolution',
    0x0128: 'ResolutionUnit',
    0x0111: 'StripOffsets',
    0x0116: 'RowsPerStrip',
    0x0117: 'StripByteCounts',
    0x0201: 'JPEGInterchangeFormat',
    0x0202: 'JPEGInterchangeFormatLength',
    0x012d: 'TransferFunction',
    0x013e: 'WhitePoint',
    0x013f: 'PrimaryChromaticities',
    0x0211: 'YCbCrCoefficients',
    0x0214: 'ReferenceBlackWhite',
    0x0132: 'DateTime',
    0x010e: 'ImageDescription',
    0x010f: 'Make',
    0x0110: 'Model',
    0x0131: 'Software',
    0x013b: 'Artist',
    0x8298: 'Copyright',
    0x8769: {
      // ExifIFDPointer
      0x9000: 'ExifVersion', // EXIF version
      0xa000: 'FlashpixVersion', // Flashpix format version
      0xa001: 'ColorSpace', // Color space information tag
      0xa002: 'PixelXDimension', // Valid width of meaningful image
      0xa003: 'PixelYDimension', // Valid height of meaningful image
      0xa500: 'Gamma',
      0x9101: 'ComponentsConfiguration', // Information about channels
      0x9102: 'CompressedBitsPerPixel', // Compressed bits per pixel
      0x927c: 'MakerNote', // Any desired information written by the manufacturer
      0x9286: 'UserComment', // Comments by user
      0xa004: 'RelatedSoundFile', // Name of related sound file
      0x9003: 'DateTimeOriginal', // Date and time when the original image was generated
      0x9004: 'DateTimeDigitized', // Date and time when the image was stored digitally
      0x9010: 'OffsetTime', // Time zone when the image file was last changed
      0x9011: 'OffsetTimeOriginal', // Time zone when the image was stored digitally
      0x9012: 'OffsetTimeDigitized', // Time zone when the image was stored digitally
      0x9290: 'SubSecTime', // Fractions of seconds for DateTime
      0x9291: 'SubSecTimeOriginal', // Fractions of seconds for DateTimeOriginal
      0x9292: 'SubSecTimeDigitized', // Fractions of seconds for DateTimeDigitized
      0x829a: 'ExposureTime', // Exposure time (in seconds)
      0x829d: 'FNumber',
      0x8822: 'ExposureProgram', // Exposure program
      0x8824: 'SpectralSensitivity', // Spectral sensitivity
      0x8827: 'PhotographicSensitivity', // EXIF 2.3, ISOSpeedRatings in EXIF 2.2
      0x8828: 'OECF', // Optoelectric conversion factor
      0x8830: 'SensitivityType',
      0x8831: 'StandardOutputSensitivity',
      0x8832: 'RecommendedExposureIndex',
      0x8833: 'ISOSpeed',
      0x8834: 'ISOSpeedLatitudeyyy',
      0x8835: 'ISOSpeedLatitudezzz',
      0x9201: 'ShutterSpeedValue', // Shutter speed
      0x9202: 'ApertureValue', // Lens aperture
      0x9203: 'BrightnessValue', // Value of brightness
      0x9204: 'ExposureBias', // Exposure bias
      0x9205: 'MaxApertureValue', // Smallest F number of lens
      0x9206: 'SubjectDistance', // Distance to subject in meters
      0x9207: 'MeteringMode', // Metering mode
      0x9208: 'LightSource', // Kind of light source
      0x9209: 'Flash', // Flash status
      0x9214: 'SubjectArea', // Location and area of main subject
      0x920a: 'FocalLength', // Focal length of the lens in mm
      0xa20b: 'FlashEnergy', // Strobe energy in BCPS
      0xa20c: 'SpatialFrequencyResponse',
      0xa20e: 'FocalPlaneXResolution', // Number of pixels in width direction per FPRUnit
      0xa20f: 'FocalPlaneYResolution', // Number of pixels in height direction per FPRUnit
      0xa210: 'FocalPlaneResolutionUnit', // Unit for measuring the focal plane resolution
      0xa214: 'SubjectLocation', // Location of subject in image
      0xa215: 'ExposureIndex', // Exposure index selected on camera
      0xa217: 'SensingMethod', // Image sensor type
      0xa300: 'FileSource', // Image source (3 == DSC)
      0xa301: 'SceneType', // Scene type (1 == directly photographed)
      0xa302: 'CFAPattern', // Color filter array geometric pattern
      0xa401: 'CustomRendered', // Special processing
      0xa402: 'ExposureMode', // Exposure mode
      0xa403: 'WhiteBalance', // 1 = auto white balance, 2 = manual
      0xa404: 'DigitalZoomRatio', // Digital zoom ratio
      0xa405: 'FocalLengthIn35mmFilm',
      0xa406: 'SceneCaptureType', // Type of scene
      0xa407: 'GainControl', // Degree of overall image gain adjustment
      0xa408: 'Contrast', // Direction of contrast processing applied by camera
      0xa409: 'Saturation', // Direction of saturation processing applied by camera
      0xa40a: 'Sharpness', // Direction of sharpness processing applied by camera
      0xa40b: 'DeviceSettingDescription',
      0xa40c: 'SubjectDistanceRange', // Distance to subject
      0xa420: 'ImageUniqueID', // Identifier assigned uniquely to each image
      0xa430: 'CameraOwnerName',
      0xa431: 'BodySerialNumber',
      0xa432: 'LensSpecification',
      0xa433: 'LensMake',
      0xa434: 'LensModel',
      0xa435: 'LensSerialNumber'
    },
    0x8825: {
      // GPSInfoIFDPointer
      0x0000: 'GPSVersionID',
      0x0001: 'GPSLatitudeRef',
      0x0002: 'GPSLatitude',
      0x0003: 'GPSLongitudeRef',
      0x0004: 'GPSLongitude',
      0x0005: 'GPSAltitudeRef',
      0x0006: 'GPSAltitude',
      0x0007: 'GPSTimeStamp',
      0x0008: 'GPSSatellites',
      0x0009: 'GPSStatus',
      0x000a: 'GPSMeasureMode',
      0x000b: 'GPSDOP',
      0x000c: 'GPSSpeedRef',
      0x000d: 'GPSSpeed',
      0x000e: 'GPSTrackRef',
      0x000f: 'GPSTrack',
      0x0010: 'GPSImgDirectionRef',
      0x0011: 'GPSImgDirection',
      0x0012: 'GPSMapDatum',
      0x0013: 'GPSDestLatitudeRef',
      0x0014: 'GPSDestLatitude',
      0x0015: 'GPSDestLongitudeRef',
      0x0016: 'GPSDestLongitude',
      0x0017: 'GPSDestBearingRef',
      0x0018: 'GPSDestBearing',
      0x0019: 'GPSDestDistanceRef',
      0x001a: 'GPSDestDistance',
      0x001b: 'GPSProcessingMethod',
      0x001c: 'GPSAreaInformation',
      0x001d: 'GPSDateStamp',
      0x001e: 'GPSDifferential',
      0x001f: 'GPSHPositioningError'
    },
    0xa005: {
      // InteroperabilityIFDPointer
      0x0001: 'InteroperabilityIndex'
    }
  };

  // IFD1 directory can contain any IFD0 tags:
  ExifMapProto.tags.ifd1 = ExifMapProto.tags;

  ExifMapProto.stringValues = {
    ExposureProgram: {
      0: 'Undefined',
      1: 'Manual',
      2: 'Normal program',
      3: 'Aperture priority',
      4: 'Shutter priority',
      5: 'Creative program',
      6: 'Action program',
      7: 'Portrait mode',
      8: 'Landscape mode'
    },
    MeteringMode: {
      0: 'Unknown',
      1: 'Average',
      2: 'CenterWeightedAverage',
      3: 'Spot',
      4: 'MultiSpot',
      5: 'Pattern',
      6: 'Partial',
      255: 'Other'
    },
    LightSource: {
      0: 'Unknown',
      1: 'Daylight',
      2: 'Fluorescent',
      3: 'Tungsten (incandescent light)',
      4: 'Flash',
      9: 'Fine weather',
      10: 'Cloudy weather',
      11: 'Shade',
      12: 'Daylight fluorescent (D 5700 - 7100K)',
      13: 'Day white fluorescent (N 4600 - 5400K)',
      14: 'Cool white fluorescent (W 3900 - 4500K)',
      15: 'White fluorescent (WW 3200 - 3700K)',
      17: 'Standard light A',
      18: 'Standard light B',
      19: 'Standard light C',
      20: 'D55',
      21: 'D65',
      22: 'D75',
      23: 'D50',
      24: 'ISO studio tungsten',
      255: 'Other'
    },
    Flash: {
      0x0000: 'Flash did not fire',
      0x0001: 'Flash fired',
      0x0005: 'Strobe return light not detected',
      0x0007: 'Strobe return light detected',
      0x0009: 'Flash fired, compulsory flash mode',
      0x000d: 'Flash fired, compulsory flash mode, return light not detected',
      0x000f: 'Flash fired, compulsory flash mode, return light detected',
      0x0010: 'Flash did not fire, compulsory flash mode',
      0x0018: 'Flash did not fire, auto mode',
      0x0019: 'Flash fired, auto mode',
      0x001d: 'Flash fired, auto mode, return light not detected',
      0x001f: 'Flash fired, auto mode, return light detected',
      0x0020: 'No flash function',
      0x0041: 'Flash fired, red-eye reduction mode',
      0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
      0x0047: 'Flash fired, red-eye reduction mode, return light detected',
      0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
      0x004d: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
      0x004f: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
      0x0059: 'Flash fired, auto mode, red-eye reduction mode',
      0x005d: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
      0x005f: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
    },
    SensingMethod: {
      1: 'Undefined',
      2: 'One-chip color area sensor',
      3: 'Two-chip color area sensor',
      4: 'Three-chip color area sensor',
      5: 'Color sequential area sensor',
      7: 'Trilinear sensor',
      8: 'Color sequential linear sensor'
    },
    SceneCaptureType: {
      0: 'Standard',
      1: 'Landscape',
      2: 'Portrait',
      3: 'Night scene'
    },
    SceneType: {
      1: 'Directly photographed'
    },
    CustomRendered: {
      0: 'Normal process',
      1: 'Custom process'
    },
    WhiteBalance: {
      0: 'Auto white balance',
      1: 'Manual white balance'
    },
    GainControl: {
      0: 'None',
      1: 'Low gain up',
      2: 'High gain up',
      3: 'Low gain down',
      4: 'High gain down'
    },
    Contrast: {
      0: 'Normal',
      1: 'Soft',
      2: 'Hard'
    },
    Saturation: {
      0: 'Normal',
      1: 'Low saturation',
      2: 'High saturation'
    },
    Sharpness: {
      0: 'Normal',
      1: 'Soft',
      2: 'Hard'
    },
    SubjectDistanceRange: {
      0: 'Unknown',
      1: 'Macro',
      2: 'Close view',
      3: 'Distant view'
    },
    FileSource: {
      3: 'DSC'
    },
    ComponentsConfiguration: {
      0: '',
      1: 'Y',
      2: 'Cb',
      3: 'Cr',
      4: 'R',
      5: 'G',
      6: 'B'
    },
    Orientation: {
      1: 'Original',
      2: 'Horizontal flip',
      3: 'Rotate 180° CCW',
      4: 'Vertical flip',
      5: 'Vertical flip + Rotate 90° CW',
      6: 'Rotate 90° CW',
      7: 'Horizontal flip + Rotate 90° CW',
      8: 'Rotate 90° CCW'
    }
  };

  ExifMapProto.getText = function (name) {
    var value = this.get(name);
    switch (name) {
      case 'LightSource':
      case 'Flash':
      case 'MeteringMode':
      case 'ExposureProgram':
      case 'SensingMethod':
      case 'SceneCaptureType':
      case 'SceneType':
      case 'CustomRendered':
      case 'WhiteBalance':
      case 'GainControl':
      case 'Contrast':
      case 'Saturation':
      case 'Sharpness':
      case 'SubjectDistanceRange':
      case 'FileSource':
      case 'Orientation':
        return this.stringValues[name][value]
      case 'ExifVersion':
      case 'FlashpixVersion':
        if (!value) return
        return String.fromCharCode(value[0], value[1], value[2], value[3])
      case 'ComponentsConfiguration':
        if (!value) return
        return (
          this.stringValues[name][value[0]] +
          this.stringValues[name][value[1]] +
          this.stringValues[name][value[2]] +
          this.stringValues[name][value[3]]
        )
      case 'GPSVersionID':
        if (!value) return
        return value[0] + '.' + value[1] + '.' + value[2] + '.' + value[3]
    }
    return String(value)
  };

  ExifMapProto.getAll = function () {
    var map = {};
    var prop;
    var obj;
    var name;
    for (prop in this) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        obj = this[prop];
        if (obj && obj.getAll) {
          map[this.ifds[prop].name] = obj.getAll();
        } else {
          name = this.tags[prop];
          if (name) map[name] = this.getText(name);
        }
      }
    }
    return map
  };

  ExifMapProto.getName = function (tagCode) {
    var name = this.tags[tagCode];
    if (typeof name === 'object') return this.ifds[tagCode].name
    return name
  }

  // Extend the map of tag names to tag codes:
  ;(function () {
    var tags = ExifMapProto.tags;
    var prop;
    var ifd;
    var subTags;
    // Map the tag names to tags:
    for (prop in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, prop)) {
        ifd = ExifMapProto.ifds[prop];
        if (ifd) {
          subTags = tags[prop];
          for (prop in subTags) {
            if (Object.prototype.hasOwnProperty.call(subTags, prop)) {
              ifd.map[subTags[prop]] = Number(prop);
            }
          }
        } else {
          ExifMapProto.map[tags[prop]] = Number(prop);
        }
      }
    }
  })();
});
});

var loadImageIptc = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(loadImage, loadImageMeta);
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  /**
   * IPTC tag map
   *
   * @name IptcMap
   * @class
   */
  function IptcMap() {}

  IptcMap.prototype.map = {
    ObjectName: 5
  };

  IptcMap.prototype.types = {
    0: 'Uint16', // ApplicationRecordVersion
    200: 'Uint16', // ObjectPreviewFileFormat
    201: 'Uint16', // ObjectPreviewFileVersion
    202: 'binary' // ObjectPreviewData
  };

  /**
   * Retrieves IPTC tag value
   *
   * @param {number|string} id IPTC tag code or name
   * @returns {object} IPTC tag value
   */
  IptcMap.prototype.get = function (id) {
    return this[id] || this[this.map[id]]
  };

  /**
   * Retrieves string for the given DataView and range
   *
   * @param {DataView} dataView Data view interface
   * @param {number} offset Offset start
   * @param {number} length Offset length
   * @returns {string} String value
   */
  function getStringValue(dataView, offset, length) {
    var outstr = '';
    var end = offset + length;
    for (var n = offset; n < end; n += 1) {
      outstr += String.fromCharCode(dataView.getUint8(n));
    }
    return outstr
  }

  /**
   * Retrieves tag value for the given DataView and range
   *
   * @param {number} tagCode tag code
   * @param {IptcMap} map IPTC tag map
   * @param {DataView} dataView Data view interface
   * @param {number} offset Range start
   * @param {number} length Range length
   * @returns {object} Tag value
   */
  function getTagValue(tagCode, map, dataView, offset, length) {
    if (map.types[tagCode] === 'binary') {
      return new Blob([dataView.buffer.slice(offset, offset + length)])
    }
    if (map.types[tagCode] === 'Uint16') {
      return dataView.getUint16(offset)
    }
    return getStringValue(dataView, offset, length)
  }

  /**
   * Combines IPTC value with existing ones.
   *
   * @param {object} value Existing IPTC field value
   * @param {object} newValue New IPTC field value
   * @returns {object} Resulting IPTC field value
   */
  function combineTagValues(value, newValue) {
    if (value === undefined) return newValue
    if (value instanceof Array) {
      value.push(newValue);
      return value
    }
    return [value, newValue]
  }

  /**
   * Parses IPTC tags.
   *
   * @param {DataView} dataView Data view interface
   * @param {number} segmentOffset Segment offset
   * @param {number} segmentLength Segment length
   * @param {object} data Data export object
   * @param {object} includeTags Map of tags to include
   * @param {object} excludeTags Map of tags to exclude
   */
  function parseIptcTags(
    dataView,
    segmentOffset,
    segmentLength,
    data,
    includeTags,
    excludeTags
  ) {
    var value, tagSize, tagCode;
    var segmentEnd = segmentOffset + segmentLength;
    var offset = segmentOffset;
    while (offset < segmentEnd) {
      if (
        dataView.getUint8(offset) === 0x1c && // tag marker
        dataView.getUint8(offset + 1) === 0x02 // record number, only handles v2
      ) {
        tagCode = dataView.getUint8(offset + 2);
        if (
          (!includeTags || includeTags[tagCode]) &&
          (!excludeTags || !excludeTags[tagCode])
        ) {
          tagSize = dataView.getInt16(offset + 3);
          value = getTagValue(tagCode, data.iptc, dataView, offset + 5, tagSize);
          data.iptc[tagCode] = combineTagValues(data.iptc[tagCode], value);
          if (data.iptcOffsets) {
            data.iptcOffsets[tagCode] = offset;
          }
        }
      }
      offset += 1;
    }
  }

  /**
   * Tests if field segment starts at offset.
   *
   * @param {DataView} dataView Data view interface
   * @param {number} offset Segment offset
   * @returns {boolean} True if '8BIM<EOT><EOT>' exists at offset
   */
  function isSegmentStart(dataView, offset) {
    return (
      dataView.getUint32(offset) === 0x3842494d && // Photoshop segment start
      dataView.getUint16(offset + 4) === 0x0404 // IPTC segment start
    )
  }

  /**
   * Returns header length.
   *
   * @param {DataView} dataView Data view interface
   * @param {number} offset Segment offset
   * @returns {number} Header length
   */
  function getHeaderLength(dataView, offset) {
    var length = dataView.getUint8(offset + 7);
    if (length % 2 !== 0) length += 1;
    // Check for pre photoshop 6 format
    if (length === 0) {
      // Always 4
      length = 4;
    }
    return length
  }

  loadImage.parseIptcData = function (dataView, offset, length, data, options) {
    if (options.disableIptc) {
      return
    }
    var markerLength = offset + length;
    while (offset + 8 < markerLength) {
      if (isSegmentStart(dataView, offset)) {
        var headerLength = getHeaderLength(dataView, offset);
        var segmentOffset = offset + 8 + headerLength;
        if (segmentOffset > markerLength) {
          // eslint-disable-next-line no-console
          console.log('Invalid IPTC data: Invalid segment offset.');
          break
        }
        var segmentLength = dataView.getUint16(offset + 6 + headerLength);
        if (offset + segmentLength > markerLength) {
          // eslint-disable-next-line no-console
          console.log('Invalid IPTC data: Invalid segment size.');
          break
        }
        // Create the iptc object to store the tags:
        data.iptc = new IptcMap();
        if (!options.disableIptcOffsets) {
          data.iptcOffsets = new IptcMap();
        }
        parseIptcTags(
          dataView,
          segmentOffset,
          segmentLength,
          data,
          options.includeIptcTags,
          options.excludeIptcTags || { 202: true } // ObjectPreviewData
        );
        return
      }
      // eslint-disable-next-line no-param-reassign
      offset += 1;
    }
  };

  // Registers this IPTC parser for the APP13 JPEG metadata segment:
  loadImage.metaDataParsers.jpeg[0xffed].push(loadImage.parseIptcData);

  loadImage.IptcMap = IptcMap;

  // Adds the following properties to the parseMetaData callback data:
  // - iptc: The iptc tags, parsed by the parseIptcData method

  // Adds the following options to the parseMetaData method:
  // - disableIptc: Disables IPTC parsing when true.
  // - disableIptcOffsets: Disables storing IPTC tag offsets when true.
  // - includeIptcTags: A map of IPTC tags to include for parsing.
  // - excludeIptcTags: A map of IPTC tags to exclude from parsing.
});
});

var loadImageIptcMap = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(loadImage, loadImageIptc);
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  var IptcMapProto = loadImage.IptcMap.prototype;

  IptcMapProto.tags = {
    0: 'ApplicationRecordVersion',
    3: 'ObjectTypeReference',
    4: 'ObjectAttributeReference',
    5: 'ObjectName',
    7: 'EditStatus',
    8: 'EditorialUpdate',
    10: 'Urgency',
    12: 'SubjectReference',
    15: 'Category',
    20: 'SupplementalCategories',
    22: 'FixtureIdentifier',
    25: 'Keywords',
    26: 'ContentLocationCode',
    27: 'ContentLocationName',
    30: 'ReleaseDate',
    35: 'ReleaseTime',
    37: 'ExpirationDate',
    38: 'ExpirationTime',
    40: 'SpecialInstructions',
    42: 'ActionAdvised',
    45: 'ReferenceService',
    47: 'ReferenceDate',
    50: 'ReferenceNumber',
    55: 'DateCreated',
    60: 'TimeCreated',
    62: 'DigitalCreationDate',
    63: 'DigitalCreationTime',
    65: 'OriginatingProgram',
    70: 'ProgramVersion',
    75: 'ObjectCycle',
    80: 'Byline',
    85: 'BylineTitle',
    90: 'City',
    92: 'Sublocation',
    95: 'State',
    100: 'CountryCode',
    101: 'Country',
    103: 'OriginalTransmissionReference',
    105: 'Headline',
    110: 'Credit',
    115: 'Source',
    116: 'CopyrightNotice',
    118: 'Contact',
    120: 'Caption',
    121: 'LocalCaption',
    122: 'Writer',
    125: 'RasterizedCaption',
    130: 'ImageType',
    131: 'ImageOrientation',
    135: 'LanguageIdentifier',
    150: 'AudioType',
    151: 'AudioSamplingRate',
    152: 'AudioSamplingResolution',
    153: 'AudioDuration',
    154: 'AudioOutcue',
    184: 'JobID',
    185: 'MasterDocumentID',
    186: 'ShortDocumentID',
    187: 'UniqueDocumentID',
    188: 'OwnerID',
    200: 'ObjectPreviewFileFormat',
    201: 'ObjectPreviewFileVersion',
    202: 'ObjectPreviewData',
    221: 'Prefs',
    225: 'ClassifyState',
    228: 'SimilarityIndex',
    230: 'DocumentNotes',
    231: 'DocumentHistory',
    232: 'ExifCameraInfo',
    255: 'CatalogSets'
  };

  IptcMapProto.stringValues = {
    10: {
      0: '0 (reserved)',
      1: '1 (most urgent)',
      2: '2',
      3: '3',
      4: '4',
      5: '5 (normal urgency)',
      6: '6',
      7: '7',
      8: '8 (least urgent)',
      9: '9 (user-defined priority)'
    },
    75: {
      a: 'Morning',
      b: 'Both Morning and Evening',
      p: 'Evening'
    },
    131: {
      L: 'Landscape',
      P: 'Portrait',
      S: 'Square'
    }
  };

  IptcMapProto.getText = function (id) {
    var value = this.get(id);
    var tagCode = this.map[id];
    var stringValue = this.stringValues[tagCode];
    if (stringValue) return stringValue[value]
    return String(value)
  };

  IptcMapProto.getAll = function () {
    var map = {};
    var prop;
    var name;
    for (prop in this) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        name = this.tags[prop];
        if (name) map[name] = this.getText(name);
      }
    }
    return map
  };

  IptcMapProto.getName = function (tagCode) {
    return this.tags[tagCode]
  }

  // Extend the map of tag names to tag codes:
  ;(function () {
    var tags = IptcMapProto.tags;
    var map = IptcMapProto.map || {};
    var prop;
    // Map the tag names to tags:
    for (prop in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, prop)) {
        map[tags[prop]] = Number(prop);
      }
    }
  })();
});
});

var loadImageOrientation = createCommonjsModule(function (module) {
(function (factory) {
  if ( module.exports) {
    factory(
      loadImage,
      loadImageScale,
      loadImageMeta
    );
  } else {
    // Browser globals:
    factory(window.loadImage);
  }
})(function (loadImage) {

  var originalTransform = loadImage.transform;
  var originalRequiresCanvas = loadImage.requiresCanvas;
  var originalRequiresMetaData = loadImage.requiresMetaData;
  var originalTransformCoordinates = loadImage.transformCoordinates;
  var originalGetTransformedOptions = loadImage.getTransformedOptions

  ;(function ($) {
    // Guard for non-browser environments (e.g. server-side rendering):
    if (!$.global.document) return
    // black+white 3x2 JPEG, with the following meta information set:
    // - EXIF Orientation: 6 (Rotated 90° CCW)
    // Image data layout (B=black, F=white):
    // BFF
    // BBB
    var testImageURL =
      'data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAA' +
      'AAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
      'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
      'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAIAAwMBEQACEQEDEQH/x' +
      'ABRAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQADAQEAAAAAAAAAAAAGBQQDCAkCBwEBAAAAAAA' +
      'AAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AG8T9NfSMEVMhQ' +
      'voP3fFiRZ+MTHDifa/95OFSZU5OzRzxkyejv8ciEfhSceSXGjS8eSdLnZc2HDm4M3BxcXw' +
      'H/9k=';
    var img = document.createElement('img');
    img.onload = function () {
      // Check if the browser supports automatic image orientation:
      $.orientation = img.width === 2 && img.height === 3;
      if ($.orientation) {
        var canvas = $.createCanvas(1, 1, true);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 1, 1, 1, 1, 0, 0, 1, 1);
        // Check if the source image coordinates (sX, sY, sWidth, sHeight) are
        // correctly applied to the auto-orientated image, which should result
        // in a white opaque pixel (e.g. in Safari).
        // Browsers that show a transparent pixel (e.g. Chromium) fail to crop
        // auto-oriented images correctly and require a workaround, e.g.
        // drawing the complete source image to an intermediate canvas first.
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=1074354
        $.orientationCropBug =
          ctx.getImageData(0, 0, 1, 1).data.toString() !== '255,255,255,255';
      }
    };
    img.src = testImageURL;
  })(loadImage);

  /**
   * Determines if the orientation requires a canvas element.
   *
   * @param {object} [options] Options object
   * @param {boolean} [withMetaData] Is metadata required for orientation
   * @returns {boolean} Returns true if orientation requires canvas/meta
   */
  function requiresCanvasOrientation(options, withMetaData) {
    var orientation = options && options.orientation;
    return (
      // Exif orientation for browsers without automatic image orientation:
      (orientation === true && !loadImage.orientation) ||
      // Orientation reset for browsers with automatic image orientation:
      (orientation === 1 && loadImage.orientation) ||
      // Orientation to defined value, requires meta for orientation reset only:
      ((!withMetaData || loadImage.orientation) &&
        orientation > 1 &&
        orientation < 9)
    )
  }

  /**
   * Determines if the image requires an orientation change.
   *
   * @param {number} [orientation] Defined orientation value
   * @param {number} [autoOrientation] Auto-orientation based on Exif data
   * @returns {boolean} Returns true if an orientation change is required
   */
  function requiresOrientationChange(orientation, autoOrientation) {
    return (
      orientation !== autoOrientation &&
      ((orientation === 1 && autoOrientation > 1 && autoOrientation < 9) ||
        (orientation > 1 && orientation < 9))
    )
  }

  /**
   * Determines orientation combinations that require a rotation by 180°.
   *
   * The following is a list of combinations that return true:
   *
   * 2 (flip) => 5 (rot90,flip), 7 (rot90,flip), 6 (rot90), 8 (rot90)
   * 4 (flip) => 5 (rot90,flip), 7 (rot90,flip), 6 (rot90), 8 (rot90)
   *
   * 5 (rot90,flip) => 2 (flip), 4 (flip), 6 (rot90), 8 (rot90)
   * 7 (rot90,flip) => 2 (flip), 4 (flip), 6 (rot90), 8 (rot90)
   *
   * 6 (rot90) => 2 (flip), 4 (flip), 5 (rot90,flip), 7 (rot90,flip)
   * 8 (rot90) => 2 (flip), 4 (flip), 5 (rot90,flip), 7 (rot90,flip)
   *
   * @param {number} [orientation] Defined orientation value
   * @param {number} [autoOrientation] Auto-orientation based on Exif data
   * @returns {boolean} Returns true if rotation by 180° is required
   */
  function requiresRot180(orientation, autoOrientation) {
    if (autoOrientation > 1 && autoOrientation < 9) {
      switch (orientation) {
        case 2:
        case 4:
          return autoOrientation > 4
        case 5:
        case 7:
          return autoOrientation % 2 === 0
        case 6:
        case 8:
          return (
            autoOrientation === 2 ||
            autoOrientation === 4 ||
            autoOrientation === 5 ||
            autoOrientation === 7
          )
      }
    }
    return false
  }

  // Determines if the target image should be a canvas element:
  loadImage.requiresCanvas = function (options) {
    return (
      requiresCanvasOrientation(options) ||
      originalRequiresCanvas.call(loadImage, options)
    )
  };

  // Determines if metadata should be loaded automatically:
  loadImage.requiresMetaData = function (options) {
    return (
      requiresCanvasOrientation(options, true) ||
      originalRequiresMetaData.call(loadImage, options)
    )
  };

  loadImage.transform = function (img, options, callback, file, data) {
    originalTransform.call(
      loadImage,
      img,
      options,
      function (img, data) {
        if (data) {
          var autoOrientation =
            loadImage.orientation && data.exif && data.exif.get('Orientation');
          if (autoOrientation > 4 && autoOrientation < 9) {
            // Automatic image orientation switched image dimensions
            var originalWidth = data.originalWidth;
            var originalHeight = data.originalHeight;
            data.originalWidth = originalHeight;
            data.originalHeight = originalWidth;
          }
        }
        callback(img, data);
      },
      file,
      data
    );
  };

  // Transforms coordinate and dimension options
  // based on the given orientation option:
  loadImage.getTransformedOptions = function (img, opts, data) {
    var options = originalGetTransformedOptions.call(loadImage, img, opts);
    var exifOrientation = data.exif && data.exif.get('Orientation');
    var orientation = options.orientation;
    var autoOrientation = loadImage.orientation && exifOrientation;
    if (orientation === true) orientation = exifOrientation;
    if (!requiresOrientationChange(orientation, autoOrientation)) {
      return options
    }
    var top = options.top;
    var right = options.right;
    var bottom = options.bottom;
    var left = options.left;
    var newOptions = {};
    for (var i in options) {
      if (Object.prototype.hasOwnProperty.call(options, i)) {
        newOptions[i] = options[i];
      }
    }
    newOptions.orientation = orientation;
    if (
      (orientation > 4 && !(autoOrientation > 4)) ||
      (orientation < 5 && autoOrientation > 4)
    ) {
      // Image dimensions and target dimensions are switched
      newOptions.maxWidth = options.maxHeight;
      newOptions.maxHeight = options.maxWidth;
      newOptions.minWidth = options.minHeight;
      newOptions.minHeight = options.minWidth;
      newOptions.sourceWidth = options.sourceHeight;
      newOptions.sourceHeight = options.sourceWidth;
    }
    if (autoOrientation > 1) {
      // Browsers which correctly apply source image coordinates to
      // auto-oriented images
      switch (autoOrientation) {
        case 2:
          // Horizontal flip
          right = options.left;
          left = options.right;
          break
        case 3:
          // 180° Rotate CCW
          top = options.bottom;
          right = options.left;
          bottom = options.top;
          left = options.right;
          break
        case 4:
          // Vertical flip
          top = options.bottom;
          bottom = options.top;
          break
        case 5:
          // Horizontal flip + 90° Rotate CCW
          top = options.left;
          right = options.bottom;
          bottom = options.right;
          left = options.top;
          break
        case 6:
          // 90° Rotate CCW
          top = options.left;
          right = options.top;
          bottom = options.right;
          left = options.bottom;
          break
        case 7:
          // Vertical flip + 90° Rotate CCW
          top = options.right;
          right = options.top;
          bottom = options.left;
          left = options.bottom;
          break
        case 8:
          // 90° Rotate CW
          top = options.right;
          right = options.bottom;
          bottom = options.left;
          left = options.top;
          break
      }
      // Some orientation combinations require additional rotation by 180°:
      if (requiresRot180(orientation, autoOrientation)) {
        var tmpTop = top;
        var tmpRight = right;
        top = bottom;
        right = left;
        bottom = tmpTop;
        left = tmpRight;
      }
    }
    newOptions.top = top;
    newOptions.right = right;
    newOptions.bottom = bottom;
    newOptions.left = left;
    // Account for defined browser orientation:
    switch (orientation) {
      case 2:
        // Horizontal flip
        newOptions.right = left;
        newOptions.left = right;
        break
      case 3:
        // 180° Rotate CCW
        newOptions.top = bottom;
        newOptions.right = left;
        newOptions.bottom = top;
        newOptions.left = right;
        break
      case 4:
        // Vertical flip
        newOptions.top = bottom;
        newOptions.bottom = top;
        break
      case 5:
        // Vertical flip + 90° Rotate CW
        newOptions.top = left;
        newOptions.right = bottom;
        newOptions.bottom = right;
        newOptions.left = top;
        break
      case 6:
        // 90° Rotate CW
        newOptions.top = right;
        newOptions.right = bottom;
        newOptions.bottom = left;
        newOptions.left = top;
        break
      case 7:
        // Horizontal flip + 90° Rotate CW
        newOptions.top = right;
        newOptions.right = top;
        newOptions.bottom = left;
        newOptions.left = bottom;
        break
      case 8:
        // 90° Rotate CCW
        newOptions.top = left;
        newOptions.right = top;
        newOptions.bottom = right;
        newOptions.left = bottom;
        break
    }
    return newOptions
  };

  // Transform image orientation based on the given EXIF orientation option:
  loadImage.transformCoordinates = function (canvas, options, data) {
    originalTransformCoordinates.call(loadImage, canvas, options, data);
    var orientation = options.orientation;
    var autoOrientation =
      loadImage.orientation && data.exif && data.exif.get('Orientation');
    if (!requiresOrientationChange(orientation, autoOrientation)) {
      return
    }
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var sourceWidth = width;
    var sourceHeight = height;
    if (
      (orientation > 4 && !(autoOrientation > 4)) ||
      (orientation < 5 && autoOrientation > 4)
    ) {
      // Image dimensions and target dimensions are switched
      canvas.width = height;
      canvas.height = width;
    }
    if (orientation > 4) {
      // Destination and source dimensions are switched
      sourceWidth = height;
      sourceHeight = width;
    }
    // Reset automatic browser orientation:
    switch (autoOrientation) {
      case 2:
        // Horizontal flip
        ctx.translate(sourceWidth, 0);
        ctx.scale(-1, 1);
        break
      case 3:
        // 180° Rotate CCW
        ctx.translate(sourceWidth, sourceHeight);
        ctx.rotate(Math.PI);
        break
      case 4:
        // Vertical flip
        ctx.translate(0, sourceHeight);
        ctx.scale(1, -1);
        break
      case 5:
        // Horizontal flip + 90° Rotate CCW
        ctx.rotate(-0.5 * Math.PI);
        ctx.scale(-1, 1);
        break
      case 6:
        // 90° Rotate CCW
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-sourceWidth, 0);
        break
      case 7:
        // Vertical flip + 90° Rotate CCW
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-sourceWidth, sourceHeight);
        ctx.scale(1, -1);
        break
      case 8:
        // 90° Rotate CW
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -sourceHeight);
        break
    }
    // Some orientation combinations require additional rotation by 180°:
    if (requiresRot180(orientation, autoOrientation)) {
      ctx.translate(sourceWidth, sourceHeight);
      ctx.rotate(Math.PI);
    }
    switch (orientation) {
      case 2:
        // Horizontal flip
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break
      case 3:
        // 180° Rotate CCW
        ctx.translate(width, height);
        ctx.rotate(Math.PI);
        break
      case 4:
        // Vertical flip
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break
      case 5:
        // Vertical flip + 90° Rotate CW
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break
      case 6:
        // 90° Rotate CW
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -height);
        break
      case 7:
        // Horizontal flip + 90° Rotate CW
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break
      case 8:
        // 90° Rotate CCW
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-width, 0);
        break
    }
  };
});
});

/* global module, require */

var js = loadImage;

export default js;
