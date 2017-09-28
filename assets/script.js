(function ($) {

    $(document).on('rex:ready', function (event, container) {
        initList(event, container);
    });


    function initList(event, container) {
        // status toggle
        if (container.find('.status-toggle').length) {
            container.find('.status-toggle').click(function() {
                var _this = $(this);

                $('#rex-js-ajax-loader').addClass('rex-visible');

                $.post(rex.frontend_url + '?rex-api-call=yform_usability_api&method=changeStatus', {
                    data_id: _this.data('id'),
                    table: _this.data('table'),
                    status: _this.data('status')
                }, function (resp) {
                    $('#rex-js-ajax-loader').removeClass('rex-visible');

                    _this.data('status', resp.message.toggle_value);
                    _this.prop('class', 'status-toggle rex-'+ resp.message.intern_status);
                    _this.find('.rex-icon').prop('class', 'rex-icon rex-icon-'+ resp.message.intern_status);
                    _this.find('.text').html(resp.message.current_label);
                });
                return false;
            });
        }


        if (container.find('.sortable-list').length) {
            var $this = container.find('.sortable-list');

            $this.find('.sort-icon').parent().addClass('sort-handle');

            Sortable.create($this.find('tbody').get(0), {
                animation: 150,
                handle: '.sort-handle',
                onUpdate: function (e) {
                    var $sort_icon = $(e.item).find('.sort-icon'),
                        $next = $(e.item).next(),
                        id = 0,
                        prio_td_index = -1,
                        lowest_prio = -1;

                    // find index of prio th
                    $this.find('thead').find('th').each(function (idx,el) {
                        var $a = $(el).find('a'),
                            href = '';
                        if (!$a.length) {
                            return true; // no link, continue
                        }
                        href = $a.attr('href');
                        if (href.indexOf('func=add') !== -1) {
                            return true; // add link, continue
                        }
                        if (href.indexOf('sort=prio') !== -1) {
                            prio_td_index = idx;
                            return false; // found prio th, store index and break
                        }
                    });
                    // find lowest prio
                    if (prio_td_index > -1) {
                        $this.find('tbody').find('tr').find('td:eq(' + prio_td_index + ')').each(function (idx,el) {
                            var prio = parseInt($(el).text());
                            if (lowest_prio < 0 || prio < lowest_prio) {
                                lowest_prio = prio;
                            }
                        });
                    }
                    // set new prio
                    if (lowest_prio > -1) {
                        $this.find('tbody').find('tr').find('td:eq(' + prio_td_index + ')').each(function (idx,el) {
                            $(el).text(lowest_prio + idx);
                        });
                    }

                    $('#rex-js-ajax-loader').addClass('rex-visible');

                    if ($next.length) {
                        id = $next.find('.sort-icon').data('id');
                    }
                    $.post(rex.frontend_url + '?rex-api-call=yform_usability_api&method=updateSort', {
                        data_id: $sort_icon.data('id'),
                        filter: $sort_icon.data('filter'),
                        table: $sort_icon.data('table'),
                        table_type: $sort_icon.data('table-type'),
                        table_sort_order: $sort_icon.data('table-sort-order') || null,
                        table_sort_field: $sort_icon.data('table-sort-field') || null,
                        next_id: id
                    }, function (resp) {
                        $('#rex-js-ajax-loader').removeClass('rex-visible');

                        if (resp.length && window.console)
                        {
                            console.log(resp);
                        }
                    });
                }
            });
        }
    }

})(jQuery);
