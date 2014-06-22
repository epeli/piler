module.exports = (Piler, mainExports) ->
  'use strict'

  ###*
   * @namespace Piler.Minifiers
  ###

  out = {
    ###*
     * Output debug messages as if it was from {@link Piler.Minifiers}
     * @function Piler.Minifiers.debug
    ###
    debug: debug = Piler.utils.debug("piler:minifiers")
  }

  minifiers = {}

  ###*
   * @function Piler.minify
  ###
  ###*
   * Minify code on demand
   *
   * @function Piler.Minifiers.minify
   * @param {Function} name
   * @param {Function} code
   * @param {Function} [options]
   * @param {Function} [cb]
   * @returns {Promise}
  ###
  out.minify = mainExports.minify = (name, code, options, cb) ->
    throw new Error("Minify '#{name}' not found") if not name or not minifiers[name]
    debug("Minifying code '#{name}'")

    minifiers[name].execute(code, options).nodeify(cb)

  ###*
   * @function Piler.addMinifier
  ###
  ###*
   * Add your own minifier
   *
   * @function Piler.Minifiers.addMinifier
   * @param {String} name Name
   * @param {Piler.FactoryFn} factoryFn Function that returns a definition
   * @returns {Function|null} Returns the old minify function, if any
  ###
  out.addMinifier = mainExports.addMinifier = (name, factoryFn) ->
    throw new Error('Missing name for minifier') if not name
    throw new Error('factoryFn must be a function') if not Piler.utils._.isFunction(factoryFn)

    oldFn = if minifiers[name] then minifiers[name] else null

    def = factoryFn(Piler)

    throw new Error("Missing 'on' for minifier '#{name}'") if not def.on
    throw new Error("Missing 'execute' for minifier '#{name}'") if not Piler.utils._.isFunction(def.execute)

    debug('Added', name, def.on)

    def.execute = Piler.utils.Q.method(def.execute)
    minifiers[name] = def

    oldFn

  ###*
   * @function Piler.removeMinifier
  ###
  ###*
   * Remove a minifier
   *
   * @function Piler.Minifiers.removeMinifier
   * @param {String} ext Extension
  ###
  out.removeMinifier = mainExports.removeMinifier = (ext) ->
    ###istanbul ignore else###
    delete minifiers[ext] if minifiers[ext]

    return

  out