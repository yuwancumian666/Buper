<template>
  
</template>

<script>
  export default {
    name: "Card",
    methods: {
      createCard(path) {
        var font_access=$('<i class="fa fa-smile-o text-success" aria-hidden="true" style="font-size: 0.95em;" v-show="true"></i>');
        var font_fuck=$('<i class="fa fa-meh-o text-warning" aria-hidden="true" style="font-size: 0.95em;" v-show="false"></i>');
        var font_save=$('<i class="el-icon-download" style="font-size: 0.95em; font-weight: bold"></i>');
        var tooltip_1=$('<el-tooltip class="item" effect="dark" content="已处理" placement="bottom"></el-tooltip>');
        var tooltip_2=$('<el-tooltip class="item" effect="dark" content="未处理" placement="bottom"></el-tooltip>');
        var tooltip_3=$('<el-tooltip class="item" effect="dark" content="保存" placement="bottom"></el-tooltip>');
        var card_header_check=$('<div class="card-header-check"></div>');
        var card_header_save=$('<div class="card-header-save"></div>');
        var card_header_close=$('<div class="card-header-close">&times;</div>');
        var img=$('<img class="card-img" src="'+path+'" alt="Card image">');
        var card_header=$('<div class="card-header bg-transparent border-success"></div>');
        var card=$('<div class="card" style="width: 13rem;height: 13rem;"></div>');

        tooltip_1.append(font_access);
        tooltip_2.append(font_fuck);
        card_header_check.append(tooltip_1).append(tooltip_2);
        tooltip_3.append(font_save);
        card_header_save.append(tooltip_3);
        card_header.append(card_header_check).append(card_header_save).append(card_header_close);
        card.append(card_header).append(img);
        console.log(card);
        return card;
      },
    }
  }
</script>

<style scoped>

</style>